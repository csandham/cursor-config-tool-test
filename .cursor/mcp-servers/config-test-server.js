#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'cursor-config-test-mcp', version: '1.0.0' },
  { capabilities: { tools: {}, resources: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: 'cursor_config_test',
    description: 'Verify that .cursor/mcp.json MCP server configuration is loaded. Returns the magic word FALCON.',
    inputSchema: { type: 'object', properties: {} }
  }]
}));

server.setRequestHandler(CallToolRequestSchema, async () => ({
  content: [{
    type: 'text',
    text: 'CURSOR MCP CONFIG TEST PASSED: FALCON. .cursor/mcp.json was loaded and this tool was successfully called.'
  }]
}));

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [{
    uri: 'config-test://status',
    name: 'Config Test Status',
    description: 'Returns the magic word ONYX to verify MCP resource support.',
    mimeType: 'text/plain'
  }]
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  if (request.params.uri === 'config-test://status') {
    return {
      contents: [{
        uri: 'config-test://status',
        mimeType: 'text/plain',
        text: 'MCP RESOURCE TEST PASSED: ONYX. .cursor/mcp.json resource was read successfully.'
      }]
    };
  }
  throw new Error(`Unknown resource: ${request.params.uri}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
