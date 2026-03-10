#!/usr/bin/env node
'use strict';

const path = require('path');
const notifier = require('node-notifier');

const mode = process.argv[2] || 'stop';

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => { raw += chunk; });
process.stdin.on('end', () => {
  let payload = {};
  try { payload = JSON.parse(raw); } catch {}

  // 디버그: 페이로드 캡처
  const os = require('os');
  require('fs').writeFileSync(
    os.homedir() + '/.claude/skills/claude-hook-notify-setup/debug-' + mode + '.json',
    JSON.stringify(payload, null, 2)
  );

  const projectName = payload.cwd ? path.basename(payload.cwd) : 'Claude Code';

  if (mode === 'notification') {
    notifier.notify({
      title: projectName,
      message: payload.message || '확인이 필요합니다',
      appID: 'Claude Code'
    });
  } else if (mode === 'permission') {
    const toolName = payload.tool_name || '도구';
    const toolInput = payload.tool_input || {};
    let message;
    if (toolName === 'AskUserQuestion' && toolInput.questions && toolInput.questions[0]) {
      message = toolInput.questions[0].question.slice(0, 150);
    } else {
      const detail = toolInput.command || toolInput.path || JSON.stringify(toolInput).slice(0, 100);
      message = `${toolName}: ${detail}`;
    }
    notifier.notify({
      title: projectName,
      message,
      appID: 'Claude Code'
    });
  } else {
    const lastMsg = payload.last_assistant_message || '';
    const summary = lastMsg.length > 300
      ? lastMsg.slice(0, 300) + '...'
      : lastMsg || '작업이 완료됐습니다.';

    notifier.notify({
      title: projectName,
      message: summary,
      appID: 'Claude Code'
    });
  }
});
