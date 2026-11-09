<?php
/*
 * GNCE Mercury contact form: https://mercury26413.org/contact.php
 *
 * The form on contact.html posts here. This script checks the message and hands it to PHP's mail() for the
 * team email (Sponsorship messages go to our head of sponsorship), with the sender's address as Reply-To, so
 * the team just presses Reply. This script keeps no copy of the message.
 *
 * Spam: a hidden field people never see or fill ("fax_only"), a minimum time on the page (the page's JavaScript
 * sends how long the page was open as "t"; without JavaScript there is no time check), no links in the name, at
 * most 3 links in the message, and limits: 5 messages an hour and 10 a day from one internet address (a whole
 * IPv6 network counts as one address), and 5 a minute and 80 a day for the whole site, under Hostinger's PHP
 * mail limits (10 a minute, 100 a day). Behind Hostinger's CDN, REMOTE_ADDR is already the visitor's address
 * (Hostinger's CDN docs), so X-Forwarded-For is never used: any client can set it.
 *
 * The limits live in one small file, counts.json, in a folder of the server's temporary folder that only this
 * account can use. Each request changes it under a lock, so posts that arrive together can't all pass. It holds
 * the send times of the last day, for the whole site and for each address code. An address code is 4 characters
 * of a salted hash of the address, a code tens of thousands of other addresses share, so the file can't be
 * traced back to a person. Times older than a day are dropped whenever the file is next used. A message is
 * counted before it is sent, so failed sends count too. If the folder can't be used safely, nothing is sent
 * (503), and the page opens the visitor's email app instead.
 *
 * With JavaScript the page posts with fetch (Accept: application/json) and shows the answer in the form; if
 * the website can't send, it opens the visitor's email app with the message. Without JavaScript the browser
 * posts here and gets a short result page. A GET goes back to the contact page.
 *
 * FROM_EMAIL should be a real mailbox on mercury26413.org, so bounce notices have somewhere to go. If messages
 * stop arriving, check in hPanel (Emails) that it exists. Works on PHP 7.4 and later.
 */
declare(strict_types=1);

const TEAM_EMAIL = 'gncemercury26413@gmail.com';    // keep in step with TEAM_EMAIL in js/main.js
const SPONSOR_EMAIL = 'margaret@mercury26413.org';  // keep in step with SPONSOR_EMAIL in js/main.js
const FROM_EMAIL = 'website@mercury26413.org';
const FROM_NAME = 'GNCE Mercury website';
const TOPICS = ['General question', 'Joining the team', 'Sponsorship', 'Outreach / collaboration'];
const ALLOWED_ORIGINS = ['https://mercury26413.org', 'https://www.mercury26413.org'];
const MAX_BODY = 65536;      // bytes; only a first check (a chunked post has no length), every field has its own
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;
const MAX_LINKS = 3;
const MIN_MS = 3000;         // time on the page before a message can be sent
const ADDRESS_PER_HOUR = 5;
const ADDRESS_PER_DAY = 10;
const SITE_PER_MINUTE = 5;
const SITE_PER_DAY = 80;

ini_set('display_errors', '0');
header_remove('X-Powered-By');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');
header('Cache-Control: no-store');
header('Referrer-Policy: same-origin');

$wants_json = stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

// ------------------------------------------------------------------ answers
function answer(int $status, bool $ok, string $code, string $message, string $field = ''): void
{
    global $wants_json;
    http_response_code($status);
    if ($wants_json) {
        header('Content-Type: application/json; charset=utf-8');
        $out = ['ok' => $ok];
        if (!$ok) {
            $out += ['error' => $code, 'message' => $message];
            if ($field !== '') {
                $out['field'] = $field;
            }
        }
        echo json_encode($out, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }
    // without JavaScript: a short page in the site's style
    header('Content-Type: text/html; charset=utf-8');
    $e = function (string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); };
    if ($ok) {
        $title = 'Thank you';
        $lead = 'Your message is on its way to the team. We’ll reply to the email address you gave.';
        $more = '';
    } else {
        $title = 'Your message wasn’t sent';
        $lead = $message;
        $more = '<p>To keep what you typed, go back to the form with your browser’s Back button.</p>'
            . '<p>You can also email us at <a href="mailto:' . TEAM_EMAIL . '">' . TEAM_EMAIL . '</a>.</p>';
    }
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        . '<meta name="robots" content="noindex"><title>' . $e($title) . ' | GNCE Mercury</title>'
        . '<link rel="stylesheet" href="css/style.css"><link rel="icon" href="images/logo-mark.png"></head>'
        . '<body><main id="main"><div class="band band--stage page-band"><div class="page-head container">'
        . '<h1>' . $e($title) . '</h1><p class="lead">' . $e($lead) . '</p></div></div>'
        . '<section class="band"><div class="container"><div class="prose">' . $more
        . '<p class="actions"><a class="text-link" href="contact.html">Contact page</a> <a class="text-link" href="index.html">Home</a></p>'
        . '</div></div></section></main></body></html>';
    exit;
}

function unavailable(): void
{
    answer(503, false, 'unavailable', 'Our website can’t send email right now.');
}

/** One line of plain text: no control, bidi or zero-width characters (they can disguise text), single spaces. */
function clean_line(string $s): string
{
    $s = preg_replace('/[\x{200B}-\x{200F}\x{202A}-\x{202E}\x{2060}-\x{2069}\x{FEFF}]/u', '', $s) ?? '';
    $s = preg_replace('/[\x00-\x1F\x7F\x{0085}\x{2028}\x{2029}]/u', ' ', $s) ?? '';
    return trim(preg_replace('/\s+/u', ' ', $s) ?? '');
}

function chars(string $s): int
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
}

/** A posted field as a string ('' when missing or not a plain value). */
function field(string $key): string
{
    $v = $_POST[$key] ?? '';
    return is_string($v) ? $v : '';
}

// ------------------------------------------------------------------ request checks
if (($_SERVER['PATH_INFO'] ?? '') !== '') {
    http_response_code(404);
    exit;
}
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'GET' || $method === 'HEAD') {
    header('Location: contact.html#contact-form', true, 303);
    exit;
}
if ($method !== 'POST') {
    header('Allow: GET, POST');
    answer(405, false, 'method', 'This address only accepts messages from the contact form.');
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY) {
    answer(413, false, 'too_large', 'That message is too long to send from the website.');
}
// Browsers say where a form was posted from. Accept our own pages (and the same host, for local testing).
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
    $o = parse_url($origin);
    $same = is_array($o) && isset($o['host']) && strtolower($o['host'] . (isset($o['port']) ? ':' . $o['port'] : '')) === $host;
    if (!$same && !in_array($origin, ALLOWED_ORIGINS, true)) {
        answer(403, false, 'origin', 'Messages can only be sent from the contact page on mercury26413.org.');
    }
}
if (!function_exists('mail')) {
    unavailable();
}

// ------------------------------------------------------------------ the fields
foreach (['name', 'email', 'topic', 'message'] as $key) {
    if (!preg_match('//u', field($key))) {
        answer(400, false, 'encoding', 'Some characters in the message couldn’t be read. Please try again.');
    }
}
$name = clean_line(field('name'));
$email = clean_line(field('email'));
$topic = clean_line(field('topic') === '' ? 'General question' : field('topic'));
$message = str_replace(["\r\n", "\r"], "\n", field('message'));
// keep tabs, line breaks and emoji joiners; drop other control characters and the bidi controls
$message = trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F\x{202A}-\x{202E}\x{2066}-\x{2069}]/u', '', $message) ?? '');
$trap = field('fax_only');
$t = field('t');

if ($name === '') {
    answer(400, false, 'name', 'Please enter your name.', 'name');
}
if (chars($name) > MAX_NAME) {
    answer(400, false, 'name', 'Please shorten your name to ' . MAX_NAME . ' characters.', 'name');
}
if (preg_match('~://|www\.|@|\.[a-z]{2,}/~i', $name)) {
    answer(400, false, 'name', 'Please enter just your name here.', 'name');
}
// an international domain as the browser didn't already convert it (user@bücher.de to user@xn--bcher-kva.de)
if (preg_match('/^([^@]+)@(.*[^\x00-\x7F].*)$/u', $email, $m) && function_exists('idn_to_ascii')) {
    $ascii = idn_to_ascii($m[2], IDNA_DEFAULT, INTL_IDNA_VARIANT_UTS46);
    if (is_string($ascii)) {
        $email = $m[1] . '@' . $ascii;
    }
}
// a plain address only: it goes into the Reply-To header as it is
if ($email === '' || strlen($email) > MAX_EMAIL || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || !preg_match('/^[^\s"\\\\(),:;<>\[\]@]+@[^\s"\\\\(),:;<>\[\]@]+$/', $email)) {
    answer(400, false, 'email', 'Please enter a valid email address, so we can reply.', 'email');
}
if (!in_array($topic, TOPICS, true)) {
    answer(400, false, 'topic', 'Please choose a topic.', 'topic');
}
if ($message === '') {
    answer(400, false, 'message', 'Please write a message.', 'message');
}
if (chars($message) > MAX_MESSAGE) {
    answer(400, false, 'message', 'Please shorten your message to ' . number_format(MAX_MESSAGE) . ' characters (it has '
        . number_format(chars($message)) . ').', 'message');
}
if (preg_match_all('~https?://|www\.~i', $message) > MAX_LINKS) {
    answer(400, false, 'links', 'Please include at most ' . MAX_LINKS . ' links.', 'message');
}

// Robots fill the hidden field: they get a normal-looking answer and nothing is sent. A send within a few
// seconds of the page opening is asked to press Send again, so a real message is never dropped without a word.
if (trim($trap) !== '') {
    answer(200, true, 'ok', '');
}
if ($t !== '' && ctype_digit($t) && strlen($t) <= 12 && (int)$t < MIN_MS) {
    answer(400, false, 'too_fast', 'Please wait a moment, then press Send message again.');
}

// ------------------------------------------------------------------ limits
umask(0077);
$dir = rtrim(sys_get_temp_dir(), '/\\') . '/mercury-contact-' . substr(hash('sha256', __DIR__), 0, 12);
if (!is_dir($dir)) {
    @mkdir($dir, 0700);
}
clearstatcache();
// only a folder this account made and no one else can use: otherwise send nothing
$me = function_exists('posix_geteuid') ? posix_geteuid() : getmyuid();
if (!is_dir($dir) || is_link($dir) || @fileowner($dir) !== $me || (@fileperms($dir) & 0077) !== 0) {
    unavailable();
}
$file = $dir . '/counts.json';
if (is_link($file)) {
    unavailable();
}
$fh = @fopen($file, 'c+');
if ($fh === false || !flock($fh, LOCK_EX)) {
    unavailable();
}
$now = time();
$data = json_decode((string)stream_get_contents($fh), true);
if (!is_array($data) || !is_string($data['salt'] ?? null) || strlen($data['salt']) < 32) {
    $data = ['salt' => bin2hex(random_bytes(16))];
}
$salt = $data['salt'];
/** The send times of the last day. */
$recent = function ($times) use ($now): array {
    return array_values(array_filter(is_array($times) ? $times : [], function ($x) use ($now) {
        return is_int($x) && $x > $now - 86400 && $x <= $now + 60;
    }));
};
/** How many of the times are within the last $seconds. */
$within = function (array $times, int $seconds) use ($now): int {
    return count(array_filter($times, function ($x) use ($now, $seconds) { return $x > $now - $seconds; }));
};
$site = $recent($data['site'] ?? []);
$addr = [];
foreach ((is_array($data['addr'] ?? null) ? $data['addr'] : []) as $c => $times) {
    $times = $recent($times);
    if ($times) {
        $addr[(string)$c] = $times;
    }
}
$ip = (string)($_SERVER['REMOTE_ADDR'] ?? '');
$bin = @inet_pton($ip);
if (is_string($bin) && strlen($bin) === 16 && strncmp($bin, str_repeat("\0", 10) . "\xff\xff", 12) !== 0) {
    $ip = bin2hex(substr($bin, 0, 8)) . '::/64';  // all addresses in one IPv6 network count as one
}
$code = 'a' . substr(hash('sha256', $salt . '|' . $ip), 0, 4);
$mine = $addr[$code] ?? [];

$refused = null;
if ($within($mine, 3600) >= ADDRESS_PER_HOUR || count($mine) >= ADDRESS_PER_DAY) {
    $refused = [429, 'rate', 'Our website has had several messages from your internet connection in a short time. Please try again later, or email us directly.'];
} elseif ($within($site, 60) >= SITE_PER_MINUTE || count($site) >= SITE_PER_DAY) {
    $refused = [503, 'busy', 'Our website has sent a lot of messages in a short time. Please email us directly.'];
} else {
    $site[] = $now;  // counted before sending, so a failed send counts too
    $addr[$code] = array_merge($mine, [$now]);
}
$json = (string)json_encode(['salt' => $salt, 'site' => $site, 'addr' => (object)$addr]);
$saved = ftruncate($fh, 0) && rewind($fh) && fwrite($fh, $json) === strlen($json) && fflush($fh);
flock($fh, LOCK_UN);
fclose($fh);
if ($refused !== null) {
    answer($refused[0], false, $refused[1], $refused[2]);
}
if (!$saved) {
    unavailable();
}

// ------------------------------------------------------------------ send
$to = $topic === 'Sponsorship' ? SPONSOR_EMAIL : TEAM_EMAIL;
$enc = function (string $s): string {
    if (!preg_match('/[^\x20-\x7E]/', $s)) {
        return $s;
    }
    return function_exists('mb_encode_mimeheader') ? mb_encode_mimeheader($s, 'UTF-8', 'B', "\r\n") : '=?UTF-8?B?' . base64_encode($s) . '?=';
};
// the visitor's name in the subject keeps each sender's messages in their own thread
$subject = $enc('[Website] ' . $topic . ' from ' . $name);
$body = "Sent from the contact form on mercury26413.org. The visitor typed the name and email address themselves;"
    . " press Reply to answer them.\n"
    . 'Name: ' . $name . "\nEmail: " . $email . "\nTopic: " . $topic . "\n\n" . $message . "\n";
$headers = [
    'From' => FROM_NAME . ' <' . FROM_EMAIL . '>',
    'Reply-To' => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => 'base64',
    'X-Mailer' => 'mercury26413.org contact form',
];
$sent = @mail($to, $subject, chunk_split(base64_encode($body)), $headers, '-f' . FROM_EMAIL);
if (!$sent) {
    answer(502, false, 'send', 'Our website couldn’t send the message.');
}
answer(200, true, 'ok', '');
