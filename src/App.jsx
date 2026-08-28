import { useEffect, useMemo, useState } from 'react'
import { Button, Chip, IconButton, ThemeProvider, createTheme } from '@mui/material'
import ArrowOutwardRounded from '@mui/icons-material/ArrowOutwardRounded'
import MenuRounded from '@mui/icons-material/MenuRounded'
import CloseRounded from '@mui/icons-material/CloseRounded'
import LinkedIn from '@mui/icons-material/LinkedIn'
import GitHub from '@mui/icons-material/GitHub'
import Instagram from '@mui/icons-material/Instagram'
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
  { type: 'PRODUCT DESIGN', title: 'Lumen Finance', text: 'A calmer way for people to understand, plan, and grow their money.', color: 'mint', number: '01' },
  { type: 'WEB DEVELOPMENT', title: 'Morrow Journal', text: 'An independent digital publication built for long-form stories.', color: 'orange', number: '02' },
  { type: 'BRAND & STRATEGY', title: 'Sonder Studio', text: 'A new identity for an architecture practice designing spaces with soul.', color: 'blue', number: '03' },
]
const photos = [
  ['https://images.unsplash.com/photo-1473445361085-b9a07f55608b?auto=format&fit=crop&w=900&q=80', 'Quiet mornings'],
  ['https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80', 'Wild coast'],
  ['https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80', 'Concrete light'],
]

function SectionTitle({ eyebrow, title, action }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action && <a className="text-link" href="#contact">{action}<ArrowOutwardRounded fontSize="small" /></a>}</div>
}

function App() {
  const [open, setOpen] = useState(false)
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
      <a className="logo" href="#top">A<span>.</span></a>
      <nav className={open ? 'open' : ''}>{nav.map(item => <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setOpen(false)}>{item}</a>)}<Button className="mobile-contact" variant="contained" href="#contact">Let’s talk</Button></nav>
      <div className="nav-actions"><IconButton className="theme-toggle" onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}>{mode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}</IconButton><Button className="contact-btn" variant="outlined" href="#contact">Let’s talk <ArrowOutwardRounded fontSize="small" /></Button></div>
      <IconButton className="menu-btn" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <CloseRounded /> : <MenuRounded />}</IconButton>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-orb" />
        <div className="hero-copy">
          <p className="intro"><span /> Hello, I’m Alex</p>
          <h1>I design thoughtful<br /><em>digital experiences.</em></h1>
          <p className="hero-text">I’m a multidisciplinary designer and developer based in Amsterdam, focused on building useful, beautiful things for the web.</p>
          <div className="hero-actions"><Button variant="contained" size="large" href="#projects">Explore my work <ArrowOutwardRounded /></Button><a href="#about" className="plain-link">More about me <span>↓</span></a></div>
        </div>
        <div className="scroll-note">SCROLL TO DISCOVER <span>↓</span></div>
      </section>

      <section id="about" className="section about container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-5"><div className="portrait"><div className="portrait-shape">AM</div><span className="stamp">CURIOUS BY NATURE<br />MAKING WITH PURPOSE</span></div></div>
          <div className="col-lg-7 about-copy"><span className="eyebrow">01 — ABOUT ME</span><h2>Curious mind.<br />Intentional maker.</h2><p className="lead">I care about the space where good design, technology, and human needs meet.</p><p>For the past eight years, I’ve partnered with startups and thoughtful teams to turn complex ideas into clear, engaging products. I believe the best work begins with listening—and gets better through collaboration.</p><a className="text-link" href="#contact">A little more about me <ArrowOutwardRounded fontSize="small" /></a></div>
        </div>
      </section>

      <section id="experience" className="section experience">
        <div className="container"><SectionTitle eyebrow="02 — EXPERIENCE" title="Where I’ve worked" />
          <div className="experience-list">
            <article><span>2022 — NOW</span><div><h3>Independent Designer</h3><p>Product design, creative direction & development</p></div><strong>Amsterdam, NL</strong></article>
            <article><span>2019 — 2022</span><div><h3>Senior Product Designer</h3><p>Northwind Digital</p></div><strong>London, UK</strong></article>
            <article><span>2017 — 2019</span><div><h3>UI/UX Designer</h3><p>Parallel Studio</p></div><strong>Berlin, DE</strong></article>
          </div>
        </div>
      </section>

      <section id="projects" className="section projects container"><SectionTitle eyebrow="03 — SELECTED WORK" title="A few things I’m proud of" action="View all projects" />
        <div className="project-grid">{projects.map(p => <article className={`project ${p.color}`} key={p.title}><div className="project-art"><span>{p.number}</span><div className="mock-card"><small>{p.type.split(' ')[0]}</small><b>{p.title.split(' ')[0]}</b><i /></div></div><Chip label={p.type} size="small" /><h3>{p.title}</h3><p>{p.text}</p><IconButton aria-label={`View ${p.title}`}><NorthEastRounded /></IconButton></article>)}</div>
      </section>

      <section id="photography" className="section photography"><div className="container"><SectionTitle eyebrow="04 — PHOTOGRAPHY" title="Scenes along the way" action="View photo journal" /><div className="photo-grid">{photos.map(([src, alt], i) => <figure key={alt} className={`photo-${i + 1}`}><img src={src} alt={alt} /><figcaption>{alt} <span>0{i + 1}</span></figcaption></figure>)}</div></div></section>

      <section id="blog" className="section blog container"><SectionTitle eyebrow="05 — NOTES" title="Ideas, process & observations" action="Read all notes" /><div className="post-grid">
        <article><span>DESIGN · 6 MIN READ</span><h3>Designing for calm in a world of endless notifications</h3><p>Some thoughts on attention, restraint, and making digital spaces feel more human.</p><a href="#contact">Read note <ArrowOutwardRounded /></a></article>
        <article><span>PROCESS · 4 MIN READ</span><h3>The case for leaving a little room unfinished</h3><p>Why ambiguity can be a useful part of the creative process—and how to work with it.</p><a href="#contact">Read note <ArrowOutwardRounded /></a></article>
      </div></section>

      <section id="contact" className="contact"><div><span className="eyebrow">HAVE A PROJECT IN MIND?</span><h2>Let’s make something<br /><em>meaningful together.</em></h2><Button variant="contained" href="mailto:hello@example.com">Start a conversation <ArrowOutwardRounded /></Button></div></section>
    </main>
    <footer><a className="logo" href="#top">A<span>.</span></a><p>© 2026 Alex Morgan. Built with care.</p><div><IconButton aria-label="LinkedIn"><LinkedIn /></IconButton><IconButton aria-label="GitHub"><GitHub /></IconButton><IconButton aria-label="Instagram"><Instagram /></IconButton></div></footer>
  </ThemeProvider>
}

export default App
