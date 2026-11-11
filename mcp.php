<?php
/*
 * GNCE Mercury MCP server: https://mercury26413.org/mcp (described at /.well-known/mcp/server-card.json)
 *
 * A Model Context Protocol server over Streamable HTTP, stateless: every POST carries one JSON-RPC message
 * (or a batch) and gets one JSON answer. It only reads the site's own files (agent/pages.json and the
 * *.html.md pages that tools/agent_files.py writes), so it can't change anything, holds no secrets and
 * needs no login. To change what the tools say, change the pages and rerun tools/agent_files.py.
 * Works on PHP 7.4 and later.
 */
declare(strict_types=1);

const SERVER_NAME = 'org.mercury26413/site';
const SERVER_TITLE = 'GNCE Mercury (FTC 26413)';
const SERVER_VERSION = '1.0.0';
const SERVER_DESCRIPTION = 'Read-only facts, pages and season schedule of FIRST Tech Challenge team GNCE Mercury 26413.';
const SITE = 'https://mercury26413.org/';
// Browser pages allowed to call this server (MCP asks servers to check Origin). Server-side clients send none.
const ALLOWED_ORIGINS = ['https://mercury26413.org', 'https://www.mercury26413.org', 'https://arnieftc.github.io'];
// Newest first. The first one is offered when a client asks for a version we don't know.
const PROTOCOL_VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26'];
// Old clients may still send a few messages as one JSON array (allowed only before 2025-06-18).
const MAX_BATCH = 10;
const MAX_BODY = 262144;

if (PHP_SAPI !== 'cli') {
    header_remove('X-Powered-By');
    header('X-Content-Type-Options: nosniff');
    header('X-Robots-Tag: noindex');
}

function send_json(int $status, $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function rpc_error($id, int $code, string $message, $data = null): array
{
    $err = ['code' => $code, 'message' => $message];
    if ($data !== null) {
        $err['data'] = $data;
    }
    return ['jsonrpc' => '2.0', 'id' => $id, 'error' => $err];
}

function rpc_result($id, $result): array
{
    return ['jsonrpc' => '2.0', 'id' => $id, 'result' => $result];
}

// ------------------------------------------------------------------ site data
function site(): array
{
    static $site = null;
    if ($site === null) {
        $raw = @file_get_contents(__DIR__ . '/agent/pages.json');
        $site = $raw === false ? null : json_decode($raw, true);
        if (!is_array($site)) {
            throw new RuntimeException('Site index agent/pages.json is missing or unreadable.');
        }
    }
    return $site;
}

function page_by_slug(string $slug): ?array
{
    foreach (site()['pages'] as $p) {
        if ($p['slug'] === $slug) {
            return $p;
        }
    }
    return null;
}

function page_markdown(array $page): string
{
    static $cache = [];
    $file = $page['markdownFile'];
    if (!isset($cache[$file])) {
        $text = @file_get_contents(__DIR__ . '/' . $file);
        if ($text === false) {
            throw new RuntimeException('That page is missing on the server.');
        }
        $cache[$file] = $text;
    }
    return $cache[$file];
}

function length(string $s): int
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
}

function slugs(): string
{
    return implode(', ', array_map(function ($p) { return $p['slug']; }, site()['pages']));
}

function lower(string $s): string
{
    return function_exists('mb_strtolower') ? mb_strtolower($s, 'UTF-8') : strtolower($s);
}

function text_content(string $text): array
{
    return [['type' => 'text', 'text' => $text]];
}

function as_json($data): string
{
    return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
}

// ------------------------------------------------------------------ tools
function tools(): array
{
    $slugs = array_map(function ($p) { return $p['slug']; }, site()['pages']);
    $readOnly = ['readOnlyHint' => true, 'destructiveHint' => false, 'idempotentHint' => true, 'openWorldHint' => false];
    return [
        [
            'name' => 'get_team_info',
            'title' => 'Team facts and contacts',
            'description' => 'Facts about GNCE Mercury, FIRST Tech Challenge team 26413 from Weston, Massachusetts: '
                . 'what the team is, when it was founded, where it is, how to reach it (general and sponsorship email, '
                . 'Instagram) and its sponsors and supporters.',
            'inputSchema' => ['type' => 'object', 'properties' => new stdClass(), 'additionalProperties' => false],
            'annotations' => ['title' => 'Team facts and contacts'] + $readOnly,
        ],
        [
            'name' => 'list_pages',
            'title' => 'List the website pages',
            'description' => 'Every page of mercury26413.org with its title, a one-line description, its web address '
                . 'and the address of its Markdown version. Use read_page to read one.',
            'inputSchema' => ['type' => 'object', 'properties' => new stdClass(), 'additionalProperties' => false],
            'annotations' => ['title' => 'List the website pages'] + $readOnly,
        ],
        [
            'name' => 'read_page',
            'title' => 'Read a page',
            'description' => 'The full text of one page of the website, as Markdown. Pages: index (home: robots, '
                . 'competition record, season calendar), seasons and seasons/<years> (each robot), team (members '
                . 'and captains), outreach, news, partners (sponsorship tiers and budget), resources, contact, terms.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => ['page' => ['type' => 'string', 'enum' => $slugs,
                    'description' => 'The page to read, e.g. "team" or "seasons/2025-2026".']],
                'required' => ['page'],
                'additionalProperties' => false,
            ],
            'annotations' => ['title' => 'Read a page'] + $readOnly,
        ],
        [
            'name' => 'search_site',
            'title' => 'Search the website',
            'description' => 'Find the sections of the website that mention some words, for example "Sustain Award", '
                . '"summer camp" or "Platinum". Returns the best matching sections with the page they are on.',
            'inputSchema' => [
                'type' => 'object',
                'properties' => [
                    'query' => ['type' => 'string', 'minLength' => 2, 'maxLength' => 200, 'description' => 'Words to look for.'],
                    'limit' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 10, 'default' => 5,
                        'description' => 'How many sections to return (1 to 10).'],
                ],
                'required' => ['query'],
                'additionalProperties' => false,
            ],
            'annotations' => ['title' => 'Search the website'] + $readOnly,
        ],
        [
            'name' => 'get_season_schedule',
            'title' => 'This season\'s events',
            'description' => 'The current season\'s kickoff and events (scrimmages and competitions) with their dates, '
                . 'which are past, which is today and which is next, in Massachusetts time.',
            'inputSchema' => ['type' => 'object', 'properties' => new stdClass(), 'additionalProperties' => false],
            'annotations' => ['title' => 'This season\'s events'] + $readOnly,
        ],
    ];
}

function call_tool(string $name, array $args): array
{
    $site = site();
    switch ($name) {
        case 'get_team_info':
            $org = $site['organization'];
            return ['content' => text_content(as_json($org)), 'structuredContent' => $org];

        case 'list_pages':
            $pages = array_map(function ($p) {
                return ['page' => $p['slug'], 'title' => $p['title'], 'description' => $p['description'],
                    'url' => $p['url'], 'markdownUrl' => $p['markdownUrl']];
            }, $site['pages']);
            return ['content' => text_content(as_json(['pages' => $pages])), 'structuredContent' => ['pages' => $pages]];

        case 'read_page':
            if (!isset($args['page']) || !is_string($args['page'])) {
                return ['isError' => true, 'content' => text_content('Say which page to read in "page", one of: ' . slugs() . '.')];
            }
            $slug = preg_replace('/\.html(\.md)?$/', '', trim($args['page'], " /"));
            if ($slug === '') {
                return ['isError' => true, 'content' => text_content('Say which page to read in "page", one of: ' . slugs() . '.')];
            }
            if ($slug === 'home') {
                $slug = 'index';
            }
            $page = page_by_slug($slug);
            if ($page === null) {
                return ['isError' => true, 'content' => text_content('No page called "' . $slug . '". Use list_pages to see the pages.')];
            }
            return ['content' => [
                ['type' => 'text', 'text' => page_markdown($page)],
            ]];

        case 'search_site':
            $query = isset($args['query']) && is_string($args['query']) ? trim($args['query']) : '';
            if (length($query) < 2 || length($query) > 200) {
                return ['isError' => true, 'content' => text_content('Give a "query" of 2 to 200 characters.')];
            }
            $limit = 5;
            if (array_key_exists('limit', $args)) {
                $l = $args['limit'];
                if (!(is_int($l) || (is_float($l) && floor($l) === $l)) || $l < 1 || $l > 10) {
                    return ['isError' => true, 'content' => text_content('"limit" must be a whole number from 1 to 10.')];
                }
                $limit = (int) $l;
            }
            $results = search($query, $limit);
            $payload = ['query' => $query, 'results' => $results];
            if (!$results) {
                $payload['note'] = 'Nothing on the site matches. Try fewer or different words, or use list_pages.';
            }
            return ['content' => text_content(as_json($payload)), 'structuredContent' => $payload];

        case 'get_season_schedule':
            $schedule = schedule($site['season']);
            return ['content' => text_content(as_json($schedule)), 'structuredContent' => $schedule];
    }
    throw new InvalidArgumentException('Unknown tool: ' . $name);
}

function search(string $query, int $limit): array
{
    $q = lower($query);
    $stop = ['the', 'a', 'an', 'and', 'or', 'is', 'are', 'was', 'of', 'in', 'on', 'at', 'to', 'for', 'me', 'my', 'you',
        'your', 'our', 'about', 'what', 'who', 'when', 'where', 'how', 'did', 'does', 'do', 'tell', 'with', 'this', 'that'];
    $words = array_values(array_filter(array_map(function ($t) { return trim($t, '.-+'); },
        preg_split('/[^\p{L}\p{N}$+.\-]+/u', $q) ?: []), function ($t) { return length($t) >= 2; }));
    $terms = array_values(array_filter($words, function ($t) use ($stop) { return !in_array($t, $stop, true); }));
    if (!$terms) {
        $terms = $words ?: [$q];
    }
    $q = trim($q, " .?!");
    $hits = [];
    foreach (site()['pages'] as $page) {
        try {
            $md = page_markdown($page);
        } catch (RuntimeException $e) {
            continue;
        }
        $md = preg_replace('/\A---\n.*?\n---\n/s', '', $md);
        $md = explode("\n* * *\n", $md)[0];
        $sections = preg_split('/\n(?=#{1,3} )/', "\n" . $md);
        foreach ($sections as $section) {
            $section = trim($section);
            if ($section === '') {
                continue;
            }
            $heading = preg_match('/^#{1,3} (.+)$/m', $section, $m) ? $m[1] : $page['title'];
            $low = lower($section);
            $score = 0;
            foreach ($terms as $t) {
                $n = substr_count($low, $t);
                $score += $n ? 2 + min($n, 5) : 0;
            }
            $matched = count(array_filter($terms, function ($t) use ($low) { return strpos($low, $t) !== false; }));
            if ($matched === 0) {
                continue;
            }
            if (strpos($low, $q) !== false) {
                $score += 10;
            }
            $score += 4 * $matched;
            $plain = preg_replace('/!\[[^\]]*\]\([^)]*\)|\[([^\]]*)\]\([^)]*\)/', '$1', $section);
            $plain = preg_replace('/^\s*(#{1,6}|>|-|\d+\.)\s+/m', '', $plain);
            $plain = preg_replace('/\*\*|(?<!\\\\)\*|`|\|/', '', $plain);
            $plain = preg_replace('/\\\\([\\\\`*_\[\]])/', '$1', $plain);
            $plain = trim(preg_replace('/\s+/', ' ', $plain));
            $pos = strpos(lower($plain), $terms[0]);
            $start = max(0, ($pos === false ? 0 : $pos) - 120);
            $snippet = function_exists('mb_strcut') ? mb_strcut($plain, $start, 360, 'UTF-8') : substr($plain, $start, 360);
            if ($start > 0 && ($sp = strpos($snippet, ' ')) !== false && $sp < 40) {
                $snippet = substr($snippet, $sp + 1);
            }
            if (strlen($plain) > $start + 360 && ($sp = strrpos($snippet, ' ')) !== false && $sp > 300) {
                $snippet = substr($snippet, 0, $sp);
            }
            $hits[] = ['score' => $score, 'page' => $page['slug'], 'pageTitle' => $page['title'], 'section' => $heading,
                'url' => $page['url'], 'snippet' => ($start > 0 ? '…' : '') . trim($snippet) . (strlen($plain) > $start + 360 ? '…' : '')];
        }
    }
    usort($hits, function ($a, $b) { return $b['score'] <=> $a['score']; });
    return array_map(function ($h) { unset($h['score']); return $h; }, array_slice($hits, 0, $limit));
}

function schedule(array $season): array
{
    $tz = new DateTimeZone($season['timeZone'] ?? 'America/New_York');
    $today = (new DateTimeImmutable('now', $tz))->format('Y-m-d');
    $points = array_merge([['name' => 'Season kickoff', 'date' => $season['kickoff']]], $season['events']);
    $next = null;
    $out = [];
    foreach ($points as $p) {
        $status = $p['date'] < $today ? 'past' : ($p['date'] === $today ? 'today' : 'upcoming');
        $day = DateTimeImmutable::createFromFormat('!Y-m-d', $p['date'], $tz);
        $row = ['name' => $p['name'], 'date' => $p['date'], 'weekday' => $day ? $day->format('l') : '', 'status' => $status];
        if ($status !== 'past' && $next === null) {
            $next = $row;
        }
        $out[] = $row;
    }
    return ['today' => $today, 'timeZone' => $tz->getName(), 'next' => $next, 'events' => $out,
        'source' => SITE];
}

// ------------------------------------------------------------------ resources
function resources(): array
{
    $list = array_map(function ($p) {
        return ['uri' => $p['markdownUrl'], 'name' => $p['slug'], 'title' => $p['title'],
            'description' => $p['description'], 'mimeType' => 'text/markdown'];
    }, site()['pages']);
    $list[] = ['uri' => SITE . 'llms.txt', 'name' => 'llms.txt', 'title' => 'Site guide for AI agents (llms.txt)',
        'description' => 'What the site is and where everything is.', 'mimeType' => 'text/plain'];
    return $list;
}

function read_resource(string $uri): ?array
{
    if ($uri === SITE . 'llms.txt') {
        $text = @file_get_contents(__DIR__ . '/llms.txt');
        return $text === false ? null : ['uri' => $uri, 'mimeType' => 'text/plain', 'text' => $text];
    }
    foreach (site()['pages'] as $p) {
        if ($p['markdownUrl'] === $uri || $p['url'] === $uri) {
            return ['uri' => $uri, 'mimeType' => 'text/markdown', 'text' => page_markdown($p)];
        }
    }
    return null;
}

// ------------------------------------------------------------------ server card
// The card is built from the same code as the server, so it always lists the tools the server really has.
// GET /.well-known/mcp/server-card.json and GET /mcp/server-card serve it (see .htaccess); the copy saved at
// .well-known/mcp/server-card.json (for hosts without PHP) is refreshed by tools/agent_files.py.
function server_info(): array
{
    return ['name' => SERVER_NAME, 'title' => SERVER_TITLE, 'version' => SERVER_VERSION,
        'description' => SERVER_DESCRIPTION, 'websiteUrl' => SITE,
        'icons' => [['src' => SITE . 'icon-192.png', 'mimeType' => 'image/png', 'sizes' => ['192x192']]]];
}

function capabilities(): array
{
    return ['tools' => ['listChanged' => false], 'resources' => ['subscribe' => false, 'listChanged' => false]];
}

function card(): array
{
    return [
        '$schema' => 'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
        'name' => SERVER_NAME,
        'version' => SERVER_VERSION,
        'title' => SERVER_TITLE,
        'description' => SERVER_DESCRIPTION,
        'websiteUrl' => SITE,
        'icons' => server_info()['icons'],
        'remotes' => [['type' => 'streamable-http', 'url' => SITE . 'mcp', 'supportedProtocolVersions' => PROTOCOL_VERSIONS]],
        // the fields of the earlier server-card draft (SEP-1649), which agent-readiness checkers still read
        'protocolVersion' => PROTOCOL_VERSIONS[0],
        'serverInfo' => ['name' => SERVER_NAME, 'title' => SERVER_TITLE, 'version' => SERVER_VERSION],
        'url' => SITE . 'mcp',
        'transport' => ['type' => 'streamable-http', 'endpoint' => '/mcp', 'url' => SITE . 'mcp'],
        'capabilities' => capabilities(),
        'authentication' => ['required' => false],
        'documentationUrl' => SITE . 'llms.txt',
        'instructions' => instructions(),
        'tools' => array_map(function ($t) {
            return ['name' => $t['name'], 'title' => $t['title'], 'description' => $t['description'],
                'inputSchema' => $t['inputSchema'], 'annotations' => $t['annotations']];
        }, tools()),
        'resources' => ['dynamic'],
        'prompts' => [],
    ];
}

function instructions(): string
{
    return 'Read-only facts about GNCE Mercury, FIRST Tech Challenge team 26413 (Weston, Massachusetts). Start with '
        . 'get_team_info or list_pages; read_page returns a whole page as Markdown and search_site finds the sections '
        . 'that mention something. Everything comes from ' . SITE . '; cite the page url when you quote it.';
}

// ------------------------------------------------------------------ JSON-RPC
function handle($msg, ?string &$negotiated)
{
    $validId = function ($id) { return is_string($id) || is_int($id); };
    if (!is_array($msg) || ($msg['jsonrpc'] ?? null) !== '2.0' || !isset($msg['method']) || !is_string($msg['method'])) {
        $isResponse = is_array($msg) && (array_key_exists('result', $msg) || array_key_exists('error', $msg));
        $id = is_array($msg) && isset($msg['id']) && $validId($msg['id']) ? $msg['id'] : null;
        return $isResponse ? null : rpc_error($id, -32600, 'Invalid Request');
    }
    $isNotification = !array_key_exists('id', $msg);
    if ($isNotification) {
        return null; // notifications/initialized, notifications/cancelled, ...: nothing to answer
    }
    $id = $msg['id'];
    if (!$validId($id)) {
        return rpc_error(null, -32600, 'Invalid Request: id must be a string or an integer');
    }
    if (array_key_exists('params', $msg) && !is_array($msg['params'])) {
        return rpc_error($id, -32602, 'params must be an object');
    }
    $params = $msg['params'] ?? [];
    try {
        switch ($msg['method']) {
            case 'initialize':
                $asked = $params['protocolVersion'] ?? '';
                $negotiated = in_array($asked, PROTOCOL_VERSIONS, true) ? $asked : PROTOCOL_VERSIONS[0];
                return rpc_result($id, [
                    'protocolVersion' => $negotiated,
                    'capabilities' => capabilities(),
                    'serverInfo' => server_info(),
                    'instructions' => instructions(),
                ]);
            case 'ping':
                return rpc_result($id, new stdClass());
            case 'tools/list':
                return rpc_result($id, ['tools' => tools()]);
            case 'tools/call':
                $name = isset($params['name']) && is_string($params['name']) ? $params['name'] : '';
                $known = array_map(function ($t) { return $t['name']; }, tools());
                if (!in_array($name, $known, true)) {
                    return rpc_error($id, -32602, 'Unknown tool: ' . $name);
                }
                $args = $params['arguments'] ?? [];
                if (!is_array($args) || ($args !== [] && array_keys($args) === range(0, count($args) - 1))) {
                    return rpc_error($id, -32602, 'arguments must be an object');
                }
                return rpc_result($id, call_tool($name, $args));
            case 'resources/list':
                return rpc_result($id, ['resources' => resources()]);
            case 'resources/templates/list':
                return rpc_result($id, ['resourceTemplates' => []]);
            case 'resources/read':
                $uri = isset($params['uri']) && is_string($params['uri']) ? $params['uri'] : '';
                $res = read_resource($uri);
                if ($res === null) {
                    return rpc_error($id, -32002, 'Resource not found', ['uri' => $uri]);
                }
                return rpc_result($id, ['contents' => [$res]]);
        }
        return rpc_error($id, -32601, 'Method not found: ' . $msg['method']);
    } catch (Throwable $e) {
        return rpc_error($id, -32603, 'Internal error: ' . $e->getMessage());
    }
}

// php mcp.php --card prints the server card (tools/agent_files.py saves it for hosts without PHP)
if (PHP_SAPI === 'cli') {
    echo json_encode(card(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), "\n";
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (isset($_GET['card'])) {
    // the server card: public, cacheable, readable from any site
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET');
    header('Access-Control-Allow-Headers: Content-Type, If-None-Match');
    header('Access-Control-Expose-Headers: ETag');
    if ($method === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
    try {
        $json = json_encode(card(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "\n";
    } catch (Throwable $e) {
        $json = @file_get_contents(__DIR__ . '/.well-known/mcp/server-card.json');
        if ($json === false) {
            send_json(503, ['error' => 'Server card unavailable']);
        }
    }
    $etag = '"' . substr(sha1($json), 0, 20) . '"';
    header('Cache-Control: public, max-age=3600');
    header('ETag: ' . $etag);
    header('Content-Type: ' . ($_GET['card'] === 'mcp' ? 'application/mcp-server-card+json' : 'application/json') . '; charset=utf-8');
    if (trim($_SERVER['HTTP_IF_NONE_MATCH'] ?? '') === $etag) {
        http_response_code(304);
        exit;
    }
    echo $method === 'HEAD' ? '' : $json;
    exit;
}

// the MCP endpoint
header('Cache-Control: no-store');
if ($origin !== '') {
    if (!in_array(rtrim($origin, '/'), ALLOWED_ORIGINS, true)) {
        send_json(403, rpc_error(null, -32600, 'Origin not allowed'));
    }
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization, MCP-Protocol-Version, Mcp-Session-Id, Mcp-Method, Mcp-Name, Last-Event-ID');
    header('Access-Control-Max-Age: 86400');
}
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($method !== 'POST') {
    header('Allow: POST, OPTIONS');
    send_json(405, [
        'error' => 'This is an MCP server (Streamable HTTP). Send JSON-RPC requests with POST.',
        'serverCard' => SITE . '.well-known/mcp/server-card.json',
        'about' => SITE . 'llms.txt',
    ]);
}
$version = $_SERVER['HTTP_MCP_PROTOCOL_VERSION'] ?? '';
if ($version !== '' && !in_array($version, PROTOCOL_VERSIONS, true)) {
    send_json(400, rpc_error(null, -32600, 'Unsupported MCP-Protocol-Version: ' . $version,
        ['supported' => PROTOCOL_VERSIONS]));
}
$body = file_get_contents('php://input', false, null, 0, MAX_BODY + 1);
if ($body === false || strlen($body) > MAX_BODY) {
    send_json(413, rpc_error(null, -32600, 'Request too large'));
}
$msg = json_decode($body, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    send_json(400, rpc_error(null, -32700, 'Parse error'));
}
$negotiated = null;
if (is_array($msg) && array_keys($msg) === range(0, count($msg) - 1) && $msg !== []) {
    if (($version !== '' && $version >= '2025-06-18') || count($msg) > MAX_BATCH) {
        send_json(400, rpc_error(null, -32600, 'Send one JSON-RPC message per request (batches are not supported here)'));
    }
    $answers = array_values(array_filter(array_map(function ($m) use (&$negotiated) { return handle($m, $negotiated); }, $msg)));
    if (!$answers) {
        header('Content-Type: application/json');
        http_response_code(202);
        exit;
    }
    send_json(200, $answers);
}
$answer = handle($msg, $negotiated);
if ($answer === null) {
    header('Content-Type: application/json');
    http_response_code(202);
    exit;
}
send_json(200, $answer);
