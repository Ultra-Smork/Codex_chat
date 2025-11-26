import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './App.css'
import { Children, cloneElement, isValidElement, useState } from 'react'
import type { ReactElement, FormEvent } from 'react'
import remarkGfm from 'remark-gfm'

type ChatMessage = {
  id: number
  role: 'user' | 'ai'
  text: string
}

const initialMessages: ChatMessage[] = [
  { id: 2, role: 'user', text: 'Расскажи, как мне начать работать с вашим API.' },
  { id: 3, role: 'ai', text: 
  "\n\nThe error `FinalizationRegistry is not defined` occurs because the JavaScript environment where your application is running does not support the [`FinalizationRegistry`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/FinalizationRegistry) API, which is part of the [WeakRefs proposal](https://github.com/tc39/proposal-weakrefs). Here's a breakdown of the issue and solutions:\n\n---\n\n### **Why This Happens**\n1. **Outdated Environment**: \n   - `FinalizationRegistry` was introduced in **ECMAScript 2021 (ES12)**. If your environment (browser, Node.js, etc.) is outdated, it won’t recognize this API.\n   - **Browser Support**: Available in Chrome 84+, Firefox 79+, Safari 14.1+, Edge 84+.\n   - **Node.js Support**: Available in Node.js 14.6.0+.\n\n2. **Polyfill/Transpiler Issues**:\n   - If you’re using tools like Babel or Webpack, ensure they are configured to handle newer APIs (though `FinalizationRegistry` cannot be polyfilled).\n\n---\n\n### **How to Fix It**\n\n#### 1. **Update Your Environment**\n   - **Browsers**: Update to a modern browser version.\n   - **Node.js**: Upgrade to Node.js 14.6.0+.\n     ```bash\n     # For Node.js, use nvm to switch versions\n     nvm install 16\n     nvm use 16\n     ```\n\n#### 2. **Check for Feature Support**\n   Use feature detection to guard against missing APIs:\n   ```javascript\n   if (typeof FinalizationRegistry !== 'undefined') {\n     // Use FinalizationRegistry safely\n     const registry = new FinalizationRegistry(heldValue => {\n       // Cleanup logic\n     });\n   } else {\n     console.warn('FinalizationRegistry is not supported in this environment.');\n   }\n   ```\n\n#### 3. **Avoid Using FinalizationRegistry (If Possible)**\n   - The `FinalizationRegistry` and `WeakRef` APIs are intended for advanced use cases (e.g., caching). Most applications don’t need them.\n   - Relying on garbage collection timing can lead to unpredictable behavior.\n\n---\n\n### **Example of the Error**\n```javascript\n// This will throw \"FinalizationRegistry is not defined\" in unsupported environments\nconst registry = new FinalizationRegistry(() => {});\n```\n\n---\n\n### **Polyfill Note**\nThere’s no true polyfill for `FinalizationRegistry` because it depends on garbage collection internals. If you must use it, ensure your target environment supports it.\n\n---\n\n### **Verify Environment Support**\n- **Browser Compatibility**: Check [Can I Use](https://caniuse.com/mdn-javascript_builtins_FinalizationRegistry).\n- **Node.js Compatibility**: Check [Node.js Release Notes](https://nodejs.org/en/releases).\n\nBy addressing environment support or removing reliance on `FinalizationRegistry`, you’ll resolve this error. Let me know if you need further clarification!"},
    {id: 4, role: 'user', text: "use a lot of emojis you know like ai's do those clankers ahahah abd i want you to compare recent models of iphones for me to get better understanding what are pros and cons of each one are"},
    {id: 5, role: 'ai',
        "text": "\n\nSure thing! Let’s break down the **latest iPhone models** (15 series) with emojis, hype, and *clanker-approved* comparisons! 🤖📱✨\n\n---\n\n### **1. iPhone 15 & 15 Plus**  \n**💰 Price:** Starts at $799 / $899  \n**🎨 Colors:** Pastel vibes (Pink, Blue, Green, Black, Yellow)  \n\n**✅ Pros:**  \n- **📸 Camera Upgrade:** 48MP main sensor! *Crispy* photos day or night 🌞🌙.  \n- **🔄 USB-C:** Finally! Charges *everything* (goodbye Lightning cable drama 🔌).  \n- **📱 Dynamic Island:** Interactive notch for notifications/music 🎵✨.  \n- **💧 Durability:** Ceramic Shield + IP68 water resistance 🌊.  \n- **🤑 Cheaper:** Entry to the \"latest\" without selling a kidney 💸.  \n\n**❌ Cons:**  \n- **🔄 60Hz Display:** No ProMotion (scrolling feels *slightly 2019* 😬).  \n- **🚫 No Zoom Love:** Only 2x optical zoom (bye, faraway birds 🦅).  \n- **🔋 Battery (15):** Just *okay* (Plus model lasts longer 🏋️♂️).  \n\n---\n\n### **2. iPhone 15 Pro**  \n**💰 Price:** Starts at $999  \n**🎨 Colors:** Fancy Titanium (Black, White, Blue, Natural)  \n\n**✅ Pros:**  \n- **🚀 A17 Pro Chip:** *3nm power* for gaming/editing 🎮🎥 (console-level graphics!).  \n- **📸 Pro Cameras:** 48MP + telephoto (3x zoom) + macro mode 🌸🔍.  \n- **🖥️ 120Hz ProMotion:** Buttery-smooth scrolling 🧈✨.  \n- **🦾 Titanium Build:** Lighter *and* tougher 💪.  \n- **⚡ USB 3 Speeds:** Transfer 4K videos *blazing fast* 🚀.  \n- **🔘 Action Button:** Customizable shortcut magic (mute? Flashlight? *You pick!* 🔧).  \n\n**❌ Cons:**  \n- **💸 Pricey:** Starts at $1K (RIP wallet 😭).  \n- **🔋 Battery Life:** Good, but *not* a marathon runner 🏃♂️.  \n- **🔥 Can get warm:** Heavy tasks = toasty hands ☀️.  \n\n---\n\n### **3. iPhone 15 Pro Max**  \n**💰 Price:** Starts at $1,199  \n**🎨 Colors:** Same Titanium swag as Pro 🖤  \n\n**✅ Pros:**  \n- **📸 ZOOM KING:** 5x tetraprism telephoto lens! *Moon pics?* 🌕🔭 (kinda).  \n- **🔋 Battery Beast:** Longest-lasting iPhone ever ⏳🔋.  \n- **🖥️ Bigger Screen:** 6.7\" for movies/gaming 🎬🎮.  \n- **All Pro perks:** A17 chip, USB 3, Action Button, etc. 🎁.  \n\n**❌ Cons:**  \n- **💸💸💸 Price:** *Starts* at $1,199 (sell a kidney + a lung? 🤑).  \n- **🏋️♂️ Heavy:** Bigger size = gym for your pockets 🏋️♀️.  \n- **Same cameras as Pro:** Except the zoom (if you *need* 5x).  \n\n---\n\n### **Quick Comparison Table!**  \n| Feature              | iPhone 15/Plus       | iPhone 15 Pro        | iPhone 15 Pro Max    |  \n|----------------------|----------------------|----------------------|----------------------|  \n| **Price**            | $799-$899            | $999+                | $1,199+              |  \n| **Chip**             | A16 Bionic           | A17 Pro              | A17 Pro              |  \n| **Display**          | 60Hz                 | 120Hz ProMotion      | 120Hz ProMotion      |  \n| **Zoom**             | 2x                   | 3x                   | **5x**               |  \n| **Battery Life**     | Good (Plus: 👍)       | Very Good            | **Best**             |  \n| **Port**             | USB 2 (slow transfers)| USB 3 (fast!)        | USB 3 (fast!)        |  \n\n---\n\n### **Who Should Buy What?** 🤔  \n- **💰 Budget + Basics:** iPhone 15 (still a BEAST for most folks!).  \n- **📸 Photo Nerds:** Pro Max for that 5x zoom *flex*.  \n- **🎮 Power Users:** Pro for A17 chip + portability.  \n- **👑 Status Symbol:** Pro Max Titanium (flex on ‘em 💅).  \n\n*TL;DR:* All iPhones 15 are 🔥, but Pro models are for *extra sparkle* ✨. Choose based on your wallet and zoom needs! 🚀"
      },

]

type ContentSegment =
  | { type: 'text'; value: string }
  | { type: 'table'; rows: string[][] }

const TABLE_LINE_REGEX = /^\s*\|.*\|\s*$/

const isSeparatorRow = (cells: string[]) =>
  cells.length > 0 &&
  cells.every((cell) => /^:?\s*-+\s*:?$/.test(cell.trim()))

const formatTableRows = (lines: string[]): string[][] => {
  return lines
    .map((line) =>
      line
        .trim()
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim()),
    )
    .filter((cells) => cells.some((cell) => cell.length))
    .filter((cells) => !isSeparatorRow(cells))
}

const splitContentSegments = (text: string): ContentSegment[] => {
  const segments: ContentSegment[] = []
  const lines = text.split('\n')
  let textBuffer: string[] = []
  let tableBuffer: string[] = []

  const flushText = () => {
    if (!textBuffer.length) return
    const value = textBuffer.join('\n').trim()
    if (value) {
      segments.push({ type: 'text', value })
    }
    textBuffer = []
  }

  const flushTable = () => {
    if (!tableBuffer.length) return
    const rows = formatTableRows(tableBuffer)
    if (rows.length) {
      segments.push({ type: 'table', rows })
    }
    tableBuffer = []
  }

  lines.forEach((line) => {
    if (TABLE_LINE_REGEX.test(line.trim())) {
      flushText()
      tableBuffer.push(line)
    } else if (!line.trim() && tableBuffer.length) {
      flushTable()
    } else {
      flushTable()
      textBuffer.push(line)
    }
  })

  flushTable()
  flushText()

  return segments
}

const markdownComponents: Components = {
  p({ children }) {
    const childArray = Children.toArray(children)
    const isLinkOnly =
      childArray.length > 0 &&
      childArray.every((child) => isValidElement(child) && child.type === 'a')

    if (isLinkOnly) {
      return (
        <>
          {childArray.map((child, index) =>
            isValidElement(child)
              ? cloneElement(child as ReactElement<{ className?: string }>, {
                  key: index,
                  className: ['TextBlock-link', (child.props as { className?: string })?.className]
                    .filter(Boolean)
                    .join(' '),
                })
              : child,
          )}
        </>
      )
    }

    return (
      <div className="TextBlock">
        <strong>{children}</strong>
      </div>
    )
  },
  ul({ children }) {
    return <ul className="List-container">{children}</ul>
  },
  ol({ children }) {
    return <ol className="List-container">{children}</ol>
  },
  li({ children }) {
    return (
      <li className="List">
        <span className="text-style-1">{children}</span>
      </li>
    )
  },
  hr() {
    return null
  },
  table({ children }) {
    return <div className="Table">{children}</div>
  },
  thead({ children }) {
    return <>{children}</>
  },
  tbody({ children }) {
    return <>{children}</>
  },
  tr({ children }) {
    return <div className="Row">{children}</div>
  },
  th({ children }) {
    return <div className="Group-table Group-table--header">{children}</div>
  },
  td({ children }) {
    return <div className="Group-table">{children}</div>
  },
  code({ inline, className, children, ...props }: any) {
    const language = className?.replace('language-', '') || 'text'
    const codeValue = String(children).replace(/\n$/, '')

    if (inline) {
      return (
        <code className="InlineCode" {...props}>
          {children}
        </code>
      )
    }

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(codeValue)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          })
          .catch(() => {
            console.warn('Не удалось скопировать текст');
          });
      }
    }

    // Visual indicator style for the copied button
    const copyButtonStyle = copied
      ? { color: '#4caf50', fontWeight: 600, transition: 'color 0.2s', display: 'flex', alignItems: 'center', gap: '4px'    }
      : { display: 'flex', alignItems: 'center', gap: '4px'};
    // make copyButtonStyle available for the button as needed


    if (language === 'text') {
      return (
        <div className="TextBlock">
          <div>
            <SyntaxHighlighter
              language={language}
              style={atomDark}
              PreTag="div"
              customStyle={{ margin: 0, width: '100%', background: 'transparent' }}
              {...props}
            >
              {codeValue}
            </SyntaxHighlighter>
          </div>
        </div>
      )
    }

    return (
      <div className="CodeBlock">
        <div className="Frame-0">
          <span className="CodeBlock-lang">{language}</span>
          <button
            type="button"
            className="Copy"
            onClick={handleCopy}
            style={copyButtonStyle}
          >
            <img 
              src="/copy.png"
              alt="Copy"
              style={{
                width: '18px',
                height: '18px',
                filter: copied ? 'grayscale(0%) brightness(1.1)' : 'grayscale(40%)',
                opacity: copied ? 1 : 0.82,
                marginRight: '2px'
              }}
            />
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="Frame-1">
          <SyntaxHighlighter
            language={language}
            style={atomDark}
            PreTag="div"
            customStyle={{ margin: 0, width: '100%', background: 'transparent' }}
            {...props}
          >
            {codeValue}
          </SyntaxHighlighter>
        </div>
      </div>
    )
  },
}

const App = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialMessages)
  const [prompt, setPrompt] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedPrompt = prompt.trim()

    if (!trimmedPrompt || isSending) {
      return
    }

    const newMessage: ChatMessage = {
      id: Date.now(),
      role: 'user',
      text: trimmedPrompt,
    }

    setChatMessages((prev) => [...prev, newMessage])
    setPrompt('')
    setError(null)
    setIsSending(true)

    try {
      const response = await fetch('http://localhost:8080/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: trimmedPrompt }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const responseData: { text?: string } = await response.json()
      const aiText = responseData?.text?.trim() || 'AI не вернул ответа.'

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          text: aiText,
        },
      ])
    } catch (err) {
      console.error(err)
      setError('Не удалось отправить запрос. Попробуйте ещё раз.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <div className="Messages">
        {chatMessages.map(({ id, role, text }) => {
          const segments = splitContentSegments(text)
          const containsTable = segments.some((segment) => segment.type === 'table')

          return (
            <div
              key={id}
              className={`Block ${role === 'ai' ? 'Block--ai' : 'Block--user'}`}
            >
              {role === 'user' ? (
                <div className={`Message ${containsTable ? 'Message--table' : ''}`}>
                  <div className={`Message-text ${containsTable ? 'Message-text--table' : ''}`}>
                    {segments.map((segment, index) =>
                      segment.type === 'table' ? (
                        <div className="Table" key={`table-${id}-${index}`}>
                          {segment.rows.map((row, rowIndex) => (
                            <div className="Row" key={`row-${id}-${rowIndex}`}>
                              {row.map((cell, cellIndex) => (
                                <div className="Group-1" key={`cell-${id}-${rowIndex}-${cellIndex}`}>
                                  <ReactMarkdown
                                    components={markdownComponents}
                                    remarkPlugins={[remarkGfm]}
                                  >
                                    {cell || '\u00A0'}
                                  </ReactMarkdown>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ReactMarkdown
                          components={markdownComponents}
                          remarkPlugins={[remarkGfm]}
                          key={`text-${id}-${index}`}
                        >
                          {segment.value}
                        </ReactMarkdown>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <div className={`Message-text ${containsTable ? 'Message-text--table' : ''}`}>
                  {segments.map((segment, index) =>
                    segment.type === 'table' ? (
                      <div className="Table" key={`table-${id}-${index}`}>
                        {segment.rows.map((row, rowIndex) => (
                          <div className="Row" key={`row-${id}-${rowIndex}`}>
                            {row.map((cell, cellIndex) => (
                              <div className="Group-1" key={`cell-${id}-${rowIndex}-${cellIndex}`}>
                                <ReactMarkdown
                                  components={markdownComponents}
                                  remarkPlugins={[remarkGfm]}
                                >
                                  {cell || '\u00A0'}
                                </ReactMarkdown>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ReactMarkdown
                        components={markdownComponents}
                        remarkPlugins={[remarkGfm]}
                        key={`text-${id}-${index}`}
                      >
                        {segment.value}
                      </ReactMarkdown>
                    ),
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Введите запрос..."
          rows={2}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
        <button type="submit" disabled={!prompt.trim() || isSending}>
          <img src="/icon-send.png" alt="Send" style={{ width: 18, height: 18, marginRight: 6, verticalAlign: 'middle' }} />{'Send'}
        </button>
      </form>
      {error && <div className="Error">{error}</div>}
    </>
  )
}

export default App