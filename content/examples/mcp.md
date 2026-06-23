---
id: mcp
status: ready
title: "MCP 파일시스템 서버 연결"
source: "https://github.com/modelcontextprotocol/servers/blob/main/README.md"
---

## 시나리오

Agent마다 API 래퍼를 새로 만들 대신, **MCP** 서버 하나로 파일·Git·시간 같은 도구를 표준 규격으로 노출할 수 있습니다.

## 따라하기

### A. 클라이언트 설정 (공식 servers README)

MCP 클라이언트 설정에 파일시스템 서버를 등록합니다. 공식 README에 나온 패키지명과 인자를 그대로 사용합니다.

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/files"]
    }
  }
}
```

`/path/to/allowed/files`는 서버가 접근할 수 있는 디렉터리로 바꿉니다.

### B. Anthropic SDK + MCP (공식 예제)

`anthropic[mcp]`와 Python 3.10+가 필요합니다. 공식 `examples/mcp_tool_runner.py` 흐름:

```bash
pip install "anthropic[mcp]"
```

```python
# 요약: StdioServerParameters로 @modelcontextprotocol/server-filesystem 실행
# → mcp ClientSession.initialize()
# → list_tools() → async_mcp_tool() 변환
# → client.beta.messages.tool_runner(...) 루프
```

전체 코드는 레포의 `examples/mcp_tool_runner.py`를 복사해 실행하세요.

## 핵심 포인트

- MCP 서버 npm 패키지: `@modelcontextprotocol/server-filesystem` (공식 servers README).
- Anthropic 연동 헬퍼: `anthropic.lib.tools.mcp.async_mcp_tool` (`mcp_tool_runner.py`).
- MCP는 **도구 연결 규약**이며, LLM 호출 자체는 별도입니다.

## 참고

- MCP servers README: https://github.com/modelcontextprotocol/servers/blob/main/README.md
- MCP 사양: https://modelcontextprotocol.io/specification/2025-06-18
- Anthropic `mcp_tool_runner.py`: https://github.com/anthropics/anthropic-sdk-python/blob/main/examples/mcp_tool_runner.py
