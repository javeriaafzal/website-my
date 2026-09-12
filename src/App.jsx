import { useEffect, useMemo, useRef, useState } from 'react'
import SnakeGame from './SnakeGame'
import InteractivePixelPortrait from './InteractivePixelPortrait'
import profilePortrait from './assets/profile.png'
import springBlossoms from './assets/photography/spring-blossoms.png'
import holidayWonder from './assets/photography/holiday-wonder.png'
import northernLights from './assets/photography/northern-lights.png'
import { Button, Chip, IconButton, SvgIcon, ThemeProvider, createTheme } from '@mui/material'
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded'
import MenuRounded from '@mui/icons-material/MenuRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import LinkedIn from '@mui/icons-material/LinkedIn'
import GitHub from '@mui/icons-material/GitHub'
import NorthEastRounded from '@mui/icons-material/NorthEastRounded'
import LightModeRounded from '@mui/icons-material/LightModeRounded'
import DarkModeRounded from '@mui/icons-material/DarkModeRounded'

const makeTheme = (mode) => createTheme({
  palette: { mode, primary: { main: mode === 'dark' ? '#8ee6a8' : '#b85c38' }, text: { primary: mode === 'dark' ? '#e8eee9' : '#27251f', secondary: mode === 'dark' ? '#9aa69f' : '#6e6a5f' } },
  typography: { fontFamily: 'DM Sans, sans-serif', button: { textTransform: 'none', fontWeight: 600 } },
  shape: { borderRadius: 10 },
})

const nav = ['About', 'Experience', 'Projects', 'Photography', 'Blog']
const projects = [
  { type: 'MULTI-AGENT SYSTEMS', title: 'Paper Company Multi-Agent Inventory Project', text: 'Designing, building, and testing a multi-agent system that supports day-to-day business operations at a fictional paper manufacturing company.', color: 'mint', number: '01', href: 'https://github.com/javeriaafzal/PaperCompanyInventory' },
  { type: 'AUTONOMOUS MONITORING', title: 'Critical Workflow Watchdog (v1)', text: 'A lightweight autonomous monitoring agent for SMB teams. It validates mission-critical frontend workflows and detects backend API failures before customers report them.', color: 'orange', number: '02', href: 'https://github.com/javeriaafzal/testing-agent' },
  { type: 'AI RESEARCH AGENT', title: 'Udaplay', text: 'UdaPlay is an AI research agent focused on video games, built as part of Udacity’s Building Agents course.', color: 'blue', number: '03', href: 'https://github.com/javeriaafzal/Udaplay' },
]
const photos = [
  [springBlossoms, 'Spring blossoms'],
  [holidayWonder, 'Holiday wonder'],
  [northernLights, 'Northern lights'],
]

function SectionTitle({ eyebrow, title, action, actionHref = '#contact' }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action && <a className="text-link" href={actionHref}>{action}<ArrowOutwardRounded fontSize="small" /></a>}</div>
}

function App() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState('portfolio')
  const playButton = useRef(null)
  const menuButton = useRef(null)
  function switchView(next) {
    setView(next)
    setOpen(false)
    if (next === 'portfolio') window.requestAnimationFrame(() => {
      const target = window.matchMedia('(max-width: 800px)').matches ? menuButton : playButton
      target.current?.focus()
    })
  }
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('portfolio-theme')
    return saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })
  const theme = useMemo(() => makeTheme(mode), [mode])

  useEffect(() => {
    document.documentElement.dataset.theme = mode
    localStorage.setItem('portfolio-theme', mode)
  }, [mode])

  return <ThemeProvider theme={theme}>
    <header className="nav-wrap">
      <a className="logo" href="#top" onClick={() => switchView('portfolio')}>J<span>.</span></a>
      <nav aria-label="Main navigation" id="main-navigation" className={open ? 'open' : ''}>{nav.map(item => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => switchView('portfolio')}>{item}</a>)}<button ref={playButton} className="play-snake" aria-pressed={view === 'game'} onClick={() => switchView(view === 'portfolio' ? 'game' : 'portfolio')}>{view === 'portfolio' ? 'Play Snake' : 'Back to portfolio'}</button><Button onClick={() => switchView('portfolio')} className="mobile-contact" variant="contained" href="#contact">Let’s talk</Button></nav>
      <div className="nav-actions"><IconButton className="theme-toggle" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>{mode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}</IconButton><Button onClick={() => switchView('portfolio')} className="contact-btn" variant="outlined" href="#contact">Let’s talk <ArrowOutwardRounded fontSize="small" /></Button></div>
      <IconButton ref={menuButton} className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open} aria-controls="main-navigation">{open ? <CloseRounded /> : <MenuRounded />}</IconButton>
    </header>

    {view === 'game' ? <SnakeGame onExit={() => switchView('portfolio')} /> : <><main id="top">
      <section className="hero">
        <div className="hero-orb" />
        <div className="hero-copy">
          <p className="intro"><span /> Hi, I’m Javeria</p>
          <h1>Engineer. Problem solver.<br /><em>Lifelong learner.</em></h1>
          <div className="hero-actions"><Button variant="contained" size="large" href="#projects">Explore my work <ArrowOutwardRounded /></Button><a href="#about" className="plain-link">More about me <span>↓</span></a></div>
        </div>
        <div className="scroll-note">SCROLL TO DISCOVER <span>↓</span></div>
      </section>

      <section id="about" className="section about container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-5"><div className="portrait"><InteractivePixelPortrait src={profilePortrait} alt="Pixelated headshot of Javeria wearing a black blazer" /><span className="stamp">CURIOUS BY NATURE<br />MAKING WITH PURPOSE</span></div></div>
          <div className="col-lg-7 about-copy">
            <span className="eyebrow">01 — ABOUT ME</span>
            <h2>Hi, I’m Javeria</h2>
            <p className="lead">I’m an engineer, problem solver, and lifelong learner with 8+ years of experience across <strong>quality engineering, automation, cloud, and AI</strong>.</p>
            <p>I’ve worked across industries ranging from banking and government to cloud infrastructure and safety-critical railway systems. Much of my career has involved stepping into complex environments, understanding what isn’t working, and finding practical ways to make things <strong>simpler, faster, and more reliable</strong>.</p>
            <p>These days, I’m especially interested in <strong>AI and Forward Deployed Engineering</strong>, exploring how intelligent systems can change the way we build, test, and deliver software.</p>
            <h3>Beyond the job title...</h3>
            <p>I’m naturally curious, occasionally obsessed with figuring something out, and always learning something new.</p>
            <p>I’m also a <strong>mom</strong>, which has probably made me even better at prioritization, improvisation, and functioning when requirements change without notice.</p>
            <p>Outside of delivery work, I enjoy writing about technology, experimenting with AI and agentic workflows, and exploring ideas that sit somewhere between <em>“this could save someone a lot of time”</em> and <em>“I wonder if I can build this.”</em></p>
            <p>This website is where I share some of that — <strong>the things I’ve built, the problems I’ve worked on, what I’m learning, and my perspective on where software engineering is going next.</strong></p>
            <p>Welcome to my little corner of the internet.</p>
            <a className="text-link" href="#contact">Let’s connect <ArrowOutwardRounded fontSize="small" /></a>
          </div>
        </div>
      </section>

      <section id="experience" className="section experience">
        <div className="container"><SectionTitle eyebrow="02 — EXPERIENCE" title="Where I’ve worked" />
          <div className="experience-list">
            <article><span>01</span><div><h3>Accenture</h3></div></article>
            <article><span>02</span><div><h3>IBM</h3></div></article>
          </div>
        </div>
      </section>

      <section id="projects" className="section projects container"><SectionTitle eyebrow="03 — SELECTED WORK" title="A few things I’m proud of" action="View all projects" />
        <div className="project-grid">{projects.map(p => <article className={`project ${p.color}`} key={p.title}><div className="project-art"><span>{p.number}</span><div className="mock-card"><small>{p.type.split(' ')[0]}</small><b>{p.title.split(' ')[0]}</b><i /></div></div><Chip label={p.type} size="small" /><h3><a href={p.href} target="_blank" rel="noopener noreferrer">{p.title}</a></h3><p>{p.text}</p><IconButton component="a" href={p.href} target="_blank" rel="noopener noreferrer" aria-label={`View ${p.title} on GitHub (opens in a new tab)`}><NorthEastRounded /></IconButton></article>)}</div>
      </section>

      <section id="photography" className="section photography"><div className="container"><SectionTitle eyebrow="04 — PHOTOGRAPHY" title="Scenes along the way" action="View photo journal" /><div className="photo-grid">{photos.map(([src, alt], i) => <figure key={alt} className={`photo-${i + 1}`}><img src={src} alt={alt} /><figcaption>{alt} <span>0{i + 1}</span></figcaption></figure>)}</div></div></section>

      <section id="blog" className="section blog container"><SectionTitle eyebrow="05 — NOTES" title="Ideas, process & observations" action="Read all notes" actionHref="https://medium.com/@javeriaafzal63" /><div className="post-grid">
        <article>
          <span>AI · LARGE LANGUAGE MODELS</span>
          <h3>LLMs for GenZ</h3>
          <p>So, LLMs, or Large Language Models, are like super smart AI buddies that can understand and generate human-like text. They work by learning patterns from tons of text data, like articles, books, and websites.</p>
          <p>When you give them a prompt, it’s like asking them a question or giving them a topic to talk about. They use what they’ve learned to come up with responses or generate text based on that prompt.</p>
          <a href="https://medium.com/@javeriaafzal63/llms-for-gen-z-59aca518760a" target="_blank" rel="noopener noreferrer" aria-label="Read LLMs for GenZ on Medium (opens in a new tab)">Read on Medium <ArrowOutwardRounded /></a>
        </article>
        <article>
          <span>AI · AGENTIC SYSTEMS</span>
          <h3>Agentic Systems- plain and simple</h3>
          <p><strong>Imagine this system as a very smart assistant with a web browser.</strong></p>
          <p>You give the system a goal, for example: <strong>“Go to this website and find specific information.”</strong></p>
          <p>Instead of you doing this yourself, the system does it for you.</p>
          <p><strong>Step 1: You tell it <em>what you want</em></strong></p>
          <p>You don’t give it detailed instructions like:</p>
          <a href="https://medium.com/@javeriaafzal63/agentic-systems-plain-and-simple-34ec62e3c5fb" target="_blank" rel="noopener noreferrer" aria-label="Read Agentic Systems- plain and simple on Medium (opens in a new tab)">Read on Medium <ArrowOutwardRounded /></a>
        </article>
      </div></section>

      <section id="contact" className="contact"><div><span className="eyebrow">HAVE A PROJECT IN MIND?</span><h2>Let’s make something<br /><em>meaningful together.</em></h2><Button variant="contained" href="mailto:hello@example.com">Start a conversation <ArrowOutwardRounded /></Button></div></section>
    </main>
    <footer>
      <a className="logo" href="#top" onClick={() => switchView('portfolio')}>J<span>.</span></a>
      <p>© 2026 Javeria Kemall. Built with care.</p>
      <div>
        <IconButton component="a" href="https://www.linkedin.com/in/javeria-kemall/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" title="LinkedIn"><LinkedIn /></IconButton>
        <IconButton component="a" href="https://github.com/javeriaafzal/" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" title="GitHub"><GitHub /></IconButton>
        <IconButton component="a" href="https://medium.com/@javeriaafzal63" target="_blank" rel="noopener noreferrer" aria-label="Medium (opens in a new tab)" title="Medium"><SvgIcon><circle cx="7" cy="12" r="6" /><ellipse cx="17" cy="12" rx="3" ry="6" /><ellipse cx="22" cy="12" rx="1" ry="5.5" /></SvgIcon></IconButton>
      </div>
    </footer></>}
  </ThemeProvider>
}

export default App


