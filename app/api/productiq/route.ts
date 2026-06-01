import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { systemPrompt, userMessage } = await req.json()

    if (!systemPrompt || !userMessage) {
      return NextResponse.json(
        { error: 'systemPrompt and userMessage are required.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      console.error('GROQ_API_KEY is not set')
      return NextResponse.json(
        { error: 'API key not configured.' },
        { status: 500 }
      )
    }

    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 2048,
          temperature: 0.7,
        }),
      }
    )

    const data = await groqResponse.json()
    console.log('Groq status:', groqResponse.status)

    if (!groqResponse.ok) {
      console.error('Groq API error:', data)
      return NextResponse.json(
        { error: data.error?.message || 'Groq API error.' },
        { status: 500 }
      )
    }

    const text = data.choices?.[0]?.message?.content || ''

    if (!text) {
      console.error('No text in Groq response:', data)
      return NextResponse.json(
        { error: 'No response generated.' },
        { status: 500 }
      )
    }

    const clean = text.replace(/```json|```/g, '').trim()
    return NextResponse.json({ text: clean }, { status: 200 })

  } catch (error) {
    console.error('ProductIQ route error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response.' },
      { status: 500 }
    )
  }
}