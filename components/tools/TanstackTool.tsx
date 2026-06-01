'use client'

import { useState, useCallback } from 'react'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function jsonToInterface(json: string, name: string): string | null {
  try {
    const parsed = JSON.parse(json)
    return buildInterface(parsed, name)
  } catch {
    return null
  }
}

function buildInterface(obj: unknown, name: string): string {
  if (Array.isArray(obj)) {
    if (obj.length === 0) return `type ${name} = unknown[]`
    return buildInterface(obj[0], name)
  }
  if (typeof obj !== 'object' || obj === null) return ''
  const lines: string[] = [`interface ${name} {`]
  for (const [key, val] of Object.entries(obj as Record<string, unknown>)) {
    lines.push(`  ${key}: ${inferType(val, key)}`)
  }
  lines.push('}')
  return lines.join('\n')
}

function inferType(val: unknown, key: string): string {
  if (val === null) return 'null'
  if (Array.isArray(val)) {
    if (val.length === 0) return 'unknown[]'
    return `${inferType(val[0], key)}[]`
  }
  if (typeof val === 'object') {
    const lines = ['{']
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      lines.push(`    ${k}: ${inferType(v, k)}`)
    }
    lines.push('  }')
    return lines.join('\n  ')
  }
  return typeof val
}

function highlightTS(code: string): React.ReactNode[] {
  const lines = code.split('\n')
  return lines.map((line, lineIdx) => {
    const tokens: React.ReactNode[] = []
    let remaining = line
    let keyIdx = 0

    while (remaining.length > 0) {
      const commentMatch = remaining.match(/^(\/\/.*)/)
      if (commentMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#6b7280', fontStyle: 'italic' }}>{commentMatch[1]}</span>)
        remaining = remaining.slice(commentMatch[1].length)
        continue
      }
      const stringMatch = remaining.match(/^(['"`][^'"`\n]*['"`])/)
      if (stringMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#4ade80' }}>{stringMatch[1]}</span>)
        remaining = remaining.slice(stringMatch[1].length)
        continue
      }
      const numMatch = remaining.match(/^(\b\d+\b)/)
      if (numMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#fb923c' }}>{numMatch[1]}</span>)
        remaining = remaining.slice(numMatch[1].length)
        continue
      }
      const kwMatch = remaining.match(/^(\b(?:import|export|from|function|return|const|let|var|type|interface|extends|async|await|true|false|null|undefined|void|default)\b)/)
      if (kwMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#c084fc' }}>{kwMatch[1]}</span>)
        remaining = remaining.slice(kwMatch[1].length)
        continue
      }
      const typeMatch = remaining.match(/^(\b[A-Z][a-zA-Z0-9]*\b)/)
      if (typeMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#fb923c' }}>{typeMatch[1]}</span>)
        remaining = remaining.slice(typeMatch[1].length)
        continue
      }
      const fnMatch = remaining.match(/^(\b[a-z][a-zA-Z0-9]*(?=\())/)
      if (fnMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#60a5fa' }}>{fnMatch[1]}</span>)
        remaining = remaining.slice(fnMatch[1].length)
        continue
      }
      const punctMatch = remaining.match(/^([{}()[\]:,.<>|&=+\-*/?!])/)
      if (punctMatch) {
        tokens.push(<span key={keyIdx++} style={{ color: '#67e8f9' }}>{punctMatch[1]}</span>)
        remaining = remaining.slice(1)
        continue
      }
      tokens.push(<span key={keyIdx++} style={{ color: '#e5e7eb' }}>{remaining[0]}</span>)
      remaining = remaining.slice(1)
    }

    return <div key={lineIdx} style={{ minHeight: '1.85em' }}>{tokens}</div>
  })
}

function generateHook(
  endpoint: string,
  method: HttpMethod,
  typeName: string,
  queryKeyName: string,
  paginated: boolean,
  enabledFlag: boolean,
  includeStaleTime: boolean,
  queryParams: string,
  generatedInterface: string | null,
): string {
  const isQuery = method === 'GET'
  const hookName = `use${capitalize(queryKeyName)}`
  const fetchFnName = `fetch${capitalize(queryKeyName)}`
  const mutFnName = `${method === 'POST' ? 'create' : method === 'DELETE' ? 'delete' : 'update'}${typeName}`

  const pathParams = (endpoint.match(/:([a-zA-Z_][a-zA-Z0-9_]*)/g) || []).map(p => p.slice(1))

  const parsedQueryParams = queryParams
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      const [name, type] = l.split(':').map(s => s.trim())
      return { name, type: type || 'string' }
    })

  const allArgs = [
    ...pathParams.map(p => `${p}: string`),
    ...parsedQueryParams.map(p => `${p.name}: ${p.type}`),
    ...(paginated && isQuery ? ['page: number = 1'] : []),
    ...(enabledFlag ? ['enabled = true'] : []),
  ].join(', ')

  const queryKeyItems = [
    `'${queryKeyName}'`,
    ...pathParams,
    ...parsedQueryParams.map(p => p.name),
    ...(paginated && isQuery ? ['page'] : []),
  ].join(', ')

  const fetchArgs = [
    ...pathParams,
    ...parsedQueryParams.map(p => p.name),
    ...(paginated && isQuery ? ['page'] : []),
  ].join(', ')

  const interfaceBlock = generatedInterface ? `${generatedInterface}\n\n` : ''

  if (isQuery) {
    return `${interfaceBlock}import { useQuery } from '@tanstack/react-query'
import type { ${typeName} } from '@/types'

export function ${hookName}(${allArgs}) {
  return useQuery<${typeName}${paginated ? '[]' : ''}>({
    queryKey: [${queryKeyItems}],
    queryFn: () => ${fetchFnName}(${fetchArgs}),${includeStaleTime ? "\n    staleTime: 5 * 60 * 1000," : ''}${enabledFlag ? '\n    enabled,' : ''}
  })
}`
  }

  return `${interfaceBlock}import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ${typeName} } from '@/types'

export function ${hookName}() {
  const queryClient = useQueryClient()

  return useMutation<${typeName}, Error, ${method === 'DELETE' ? 'string' : `Partial<${typeName}>`}>({
    mutationFn: (${method === 'DELETE' ? 'id' : 'data'}) => ${mutFnName}(${method === 'DELETE' ? 'id' : 'data'}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['${queryKeyName}'] })
    },
  })
}`
}

export default function TanstackTool() {
  const [endpoint, setEndpoint] = useState('/api/users/:id/orders')
  const [method, setMethod] = useState<HttpMethod>('GET')
  const [typeName, setTypeName] = useState('Order')
  const [queryKeyName, setQueryKeyName] = useState('userOrders')
  const [paginated, setPaginated] = useState(true)
  const [enabledFlag, setEnabledFlag] = useState(false)
  const [includeStaleTime, setIncludeStaleTime] = useState(true)
  const [queryParams, setQueryParams] = useState('')
  const [responseJson, setResponseJson] = useState('')
  const [requestBodyJson, setRequestBodyJson] = useState('')
  const [generatedInterface, setGeneratedInterface] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generatedHook = generateHook(
    endpoint, method, typeName, queryKeyName,
    paginated, enabledFlag, includeStaleTime,
    queryParams, generatedInterface,
  )

  const copyHook = useCallback(() => {
    navigator.clipboard.writeText(generatedHook)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [generatedHook])

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="tanstack-grid">

        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '5px' }}>Endpoint URL</label>
            <input type="text" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder="/api/users/:id" style={{ width: '100%', padding: '9px 12px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '5px' }}>HTTP method</label>
            <div style={{ display: 'flex', border: '0.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
              {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as HttpMethod[]).map((m, i, arr) => (
                <button key={m} onClick={() => setMethod(m)} style={{ flex: 1, padding: '8px 4px', fontSize: '11px', fontFamily: 'var(--font-mono)', border: 'none', borderRight: i < arr.length - 1 ? '0.5px solid var(--border)' : 'none', background: method === m ? 'var(--amber)' : 'var(--bg-elevated)', color: method === m ? 'var(--bg-base)' : 'var(--text-ghost)', cursor: 'pointer', fontWeight: method === m ? 700 : 400 }}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '5px' }}>Type name</label>
              <input type="text" value={typeName} onChange={(e) => setTypeName(e.target.value)} placeholder="User" style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '5px' }}>Query key</label>
              <input type="text" value={queryKeyName} onChange={(e) => setQueryKeyName(e.target.value)} placeholder="users" style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '5px' }}>
              Query params <span style={{ color: 'var(--text-whisper)', textTransform: 'none', letterSpacing: 0 }}>— name: type per line</span>
            </label>
            <textarea value={queryParams} onChange={(e) => setQueryParams(e.target.value)} rows={3} placeholder={'status: string\nlimit: number'} style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '11px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none', resize: 'none', lineHeight: 1.7 }} />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '5px' }}>
              Response JSON <span style={{ color: 'var(--text-whisper)', textTransform: 'none', letterSpacing: 0 }}>— paste from Swagger</span>
            </label>
            <textarea
              value={responseJson}
              onChange={(e) => {
                setResponseJson(e.target.value)
                setGeneratedInterface(jsonToInterface(e.target.value, typeName))
              }}
              rows={4}
              placeholder={'{\n  "id": 1,\n  "name": "John"\n}'}
              style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-elevated)', border: `0.5px solid ${responseJson && !generatedInterface ? 'rgba(239,68,68,0.4)' : 'var(--border)'}`, borderRadius: '7px', fontSize: '11px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none', resize: 'none', lineHeight: 1.7 }}
            />
            {responseJson && !generatedInterface && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#f87171', marginTop: '4px' }}>Invalid JSON</p>}
            {generatedInterface && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#4ade80', marginTop: '4px' }}>✓ Interface generated</p>}
          </div>

          {['POST', 'PUT', 'PATCH'].includes(method) && (
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-ghost)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '5px' }}>
                Request body JSON <span style={{ color: 'var(--text-whisper)', textTransform: 'none', letterSpacing: 0 }}>— paste from Swagger</span>
              </label>
              <textarea value={requestBodyJson} onChange={(e) => setRequestBodyJson(e.target.value)} rows={3} placeholder={'{\n  "name": "string"\n}'} style={{ width: '100%', padding: '8px 10px', background: 'var(--bg-elevated)', border: '0.5px solid var(--border)', borderRadius: '7px', fontSize: '11px', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', outline: 'none', resize: 'none', lineHeight: 1.7 }} />
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { label: 'Paginated', val: paginated, set: setPaginated, show: method === 'GET' },
              { label: 'Enabled flag', val: enabledFlag, set: setEnabledFlag, show: true },
              { label: 'staleTime', val: includeStaleTime, set: setIncludeStaleTime, show: method === 'GET' },
            ].filter(o => o.show).map((opt) => (
              <label key={opt.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-dim)', cursor: 'pointer' }}>
                <input type="checkbox" checked={opt.val} onChange={(e) => opt.set(e.target.checked)} />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* RIGHT — OUTPUT */}
        <div style={{ background: '#0d0f14', border: '0.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', background: '#080a0e' }}>
            <div style={{ display: 'flex', gap: '5px' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', opacity: 0.7, display: 'inline-block' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', opacity: 0.7, display: 'inline-block' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', opacity: 0.7, display: 'inline-block' }} />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#4b5280' }}>
              use{capitalize(queryKeyName || 'hook')}.ts
            </span>
            <button onClick={copyHook} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: copied ? '#4ade80' : '#f59e0b', background: 'none', border: 'none', cursor: 'pointer' }}>
              {copied ? '✓ Copied' : '⎘ Copy'}
            </button>
          </div>
          <div style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '11px', lineHeight: 1.85, overflowX: 'auto', overflowY: 'auto', maxHeight: '480px', flex: 1 }}>
            {highlightTS(generatedHook)}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .tanstack-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}