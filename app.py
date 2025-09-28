import streamlit as st
import requests
import time
import streamlit.components.v1 as components
import plotly.graph_objects as go
import pandas as pd
import os
from dotenv import load_dotenv

# --- Performance and Security Configuration ---
st.set_page_config(
    page_title="ChainCompass AI Suite | Professional DeFi Analytics",
    page_icon="🧭",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        'Get Help': 'https://chaincompass-ai.com/support',
        'Report a bug': 'https://chaincompass-ai.com/bug-report',
        'About': 'ChainCompass AI Suite - Professional DeFi Analytics Platform v2.1.0'
    }
)

# Load environment variables for configurable API endpoints
load_dotenv()
API_BASE_URL = os.getenv("API_BASE_URL", "https://chaincompass-ai-krishnav.onrender.com")

# --- Asset & Style Management ---
@st.cache_data
def get_logo_as_html(width="100%"):
    """Returns the SVG code for the logo as an HTML string."""
    logo_svg = f"""
    <svg width="{width}" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#A770EF;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#CF8BF3;stop-opacity:1" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <circle cx="75" cy="75" r="65" fill="rgba(10, 5, 30, 0.75)" stroke="url(#grad1)" stroke-width="2" filter="url(#glow)"/>
        <path d="M75 20 L85 65 L75 55 L65 65 Z" fill="url(#grad1)"/>
        <path d="M75 130 L65 85 L75 95 L85 85 Z" fill="url(#grad1)" opacity="0.7"/>
        <path d="M20 75 L65 85 L55 75 L65 65 Z" fill="url(#grad1)" opacity="0.7"/>
        <path d="M130 75 L85 65 L95 75 L85 85 Z" fill="url(#grad1)" opacity="0.7"/>
        <circle cx="75" cy="75" r="15" fill="#020418"/>
        <text x="75" y="82" font-family="Poppins, sans-serif" font-size="14" fill="#CF8BF3" text-anchor="middle" font-weight="600">AI</text>
    </svg>
    """
    style = "padding: 1rem;"
    if width != "100%":
        style += f" width: {width};"
    return f'<div style="{style}">{logo_svg}</div>'

def apply_custom_styling():
    """Injects all custom CSS for the entire multi-page application."""
    custom_css = """
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
    
    :root {
        /* Common */
        --primary-gradient: linear-gradient(135deg, #4f46e5 0%, #a21caf 100%);
        --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        --accent-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        --text-accent: #00f2fe;
        --focus-outline: 2px solid #00f2fe;

        /* Dark theme defaults */
        --app-bg: #09090b;
        --dark-bg: #09090b;
        --card-bg: #18181b;
        --card-border: #27272a;
        --text-primary: #f4f4f5;
        --text-secondary: #a1a1aa;
        --sidebar-bg: #18181b;
        --surface-weak: #232336;
        --surface-medium: #232336;
        --scrollbar-track: #232336;
        --shadow-glow: 0 0 24px #a21caf44;
        --shadow-card: 0 8px 32px #00000066;
    }

    /* Light theme overrides */
    body[data-theme="light"], body[data-theme="light"] .stApp {
        --app-bg: #ffffff !important;
        --card-bg: #ffffff !important;
        --card-border: #d1d5db !important;
        --text-primary: #111827 !important;
        --text-secondary: #6b7280 !important;
        --sidebar-bg: #f9fafb !important;
        --surface-weak: #f3f4f6 !important;
        --surface-medium: #e5e7eb !important;
        --scrollbar-track: #e5e7eb !important;
        --shadow-glow: 0 0 20px #a21caf22 !important;
        --shadow-card: 0 4px 20px #11182711 !important;
        background: #ffffff !important;
    }
    
    /* Enhanced light mode fixes */
    body[data-theme="light"] * {
        color: var(--text-primary) !important;
    }
    
    body[data-theme="light"] .stButton > button {
        background: #ffffff !important;
        color: #111827 !important;
        border: 2px solid #d1d5db !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
    }
    
    body[data-theme="light"] .stButton > button:hover {
        background: #f3f4f6 !important;
        color: #111827 !important;
        border-color: #667eea !important;
    }
    
    body[data-theme="light"] input, 
    body[data-theme="light"] select {
        background: #ffffff !important;
        color: #111827 !important;
        border-color: #d1d5db !important;
    }
    
    /* Fix placeholder text in light mode */
    body[data-theme="light"] input::placeholder {
        color: #9ca3af !important;
    }
    
    /* Fix dropdown options in light mode */
    body[data-theme="light"] [data-baseweb="select"] {
        background: #ffffff !important;
        color: #111827 !important;
    }
    
    /* Fix any remaining text elements */
    body[data-theme="light"] .stMarkdown,
    body[data-theme="light"] .stText,
    body[data-theme="light"] label {
        color: #111827 !important;
    }
    
    * { box-sizing: border-box; }
    
    /* Force removal of any top black space */
    html, body {
        margin: 0 !important;
        padding: 0 !important;
        height: 100vh !important;
        overflow: hidden !important;
    }
    
    #root {
        margin: 0 !important;
        padding: 0 !important;
        height: 100vh !important;
    }
    
    /* Ultimate black space removal */
    /* Root container fixes - restore proper layout */
    html, body {
        height: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    
    /* Streamlit root app container */
    .stApp {
        margin-top: 0 !important;
        padding-top: 0 !important;
        min-height: 100vh !important;
        position: relative !important;
        background: var(--app-bg) !important;
        display: flex !important;
        flex-direction: row !important;
    }
    
    /* Force immediate content start */
    .stApp::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 0;
        background: var(--app-bg);
        z-index: 1000;
    }
    
    /* Remove Streamlit's default header spacing */
    section[data-testid="stAppViewContainer"] {
        padding-top: 0 !important;
        margin-top: 0 !important;
        background: var(--app-bg) !important;
    }
    
    /* Ensure main content fills viewport properly */
    .main {
        padding-top: 0 !important;
        margin-top: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        background: var(--app-bg) !important;
        flex: 1 !important;
        min-height: 100vh !important;
    }
    
    /* Make block container work properly */
    .main .block-container {
        flex: 1 !important;
        padding: 0 !important;
        margin: 0 !important;
        display: flex !important;
        flex-direction: column !important;
        background: var(--app-bg) !important;
        min-height: calc(100vh - 2rem) !important;
    }
    
    /* Restore proper layout control */
    .stApp {
        min-height: 100vh !important;
        overflow: auto !important;
        display: flex !important;
        flex-direction: row !important;
        background: var(--app-bg) !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    
    /* Ensure no gaps or black space anywhere */
    .stApp * {
        box-sizing: border-box !important;
    }
    
    /* Control main content area to display properly */
    .main {
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: auto !important;
        background: var(--app-bg) !important;
        padding: 0 !important;
        margin: 0 !important;
        min-height: 100vh !important;
    }
    
    /* Restore visibility to main content */
    .main > div {
        background: var(--app-bg) !important;
        flex: 1 !important;
    }
    
    /* Remove black header area and minimize top spacing */
    .stApp > header {
        height: 0 !important;
        display: none !important;
    }
    
    [data-testid="stHeader"] {
        height: 0 !important;
        display: none !important;
    }
    
    .stApp > div[data-testid="stToolbar"] {
        height: 0 !important;
        display: none !important;
    }
    
    /* Remove top margin/padding from main content */
    .main .block-container {
        background: transparent !important;
        color: var(--text-primary) !important;
        padding-top: 0.5rem !important;
        max-width: 100% !important;
        margin-top: 0 !important;
    }
    
    /* Ensure main content starts at the top */
    .stApp {
        background: var(--app-bg) !important;
        color: var(--text-primary) !important;
        padding-top: 0 !important;
        margin-top: 0 !important;
    }
    
    /* Remove any iframe padding/margin that creates black space */
    .stApp iframe {
        margin: 0 !important;
        padding: 0 !important;
    }
    
    /* Remove toolbar completely */
    div[data-testid="stDecoration"] {
        display: none !important;
    }
    
    /* Streamlit main content area - restore functionality */
    .main {
        background: var(--app-bg) !important;
        color: var(--text-primary) !important;
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow-y: auto !important;
        min-height: 100vh !important;
    }
    
    /* Fix block container for proper content display */
    .main .block-container {
        flex: 1 !important;
        background: var(--app-bg) !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow-y: auto !important;
        display: flex !important;
        flex-direction: column !important;
    }
    
    /* Ensure content is visible */
    .main .block-container > div {
        background: var(--app-bg) !important;
        flex: 1 !important;
        display: flex !important;
        flex-direction: column !important;
    }
    
    /* Enhanced Typography System */
    h1, h2, h3, h4, h5, h6 {
        font-family: 'Inter', sans-serif !important;
        font-weight: 700 !important;
        color: var(--text-primary) !important;
        margin: 0 0 1rem 0 !important;
        letter-spacing: -0.02em !important;
    }
    
    h1 { font-size: 2.5rem !important; font-weight: 800 !important; }
    h2 { font-size: 2rem !important; }
    h3 { font-size: 1.5rem !important; }
    h4 { font-size: 1.25rem !important; }
    
    /* Perfect paragraph styling */
    p {
        font-family: 'Inter', sans-serif !important;
        color: var(--text-primary) !important;
        line-height: 1.6 !important;
        margin: 0 0 1rem 0 !important;
    }
    
    /* Code and monospace perfection */
    code, pre {
        font-family: 'JetBrains Mono', monospace !important;
        background: var(--surface-medium) !important;
        color: var(--text-primary) !important;
        border-radius: 6px !important;
        padding: 0.2em 0.4em !important;
        font-size: 0.9em !important;
    }

    /* Force light mode text visibility */
    body[data-theme="light"] * {
        color: inherit !important;
    }
    
    body[data-theme="light"] .main .block-container,
    body[data-theme="light"] .stMarkdown,
    body[data-theme="light"] .stMarkdown p {
        color: var(--text-primary) !important;
    }
    
    /* Critical Streamlit overrides */
    div[data-testid="stVerticalBlock"] > div:first-child {
        background: transparent !important;
    }
    
    /* Remove any remaining black/dark areas at the top */
    .stApp > div:first-child {
        background: transparent !important;
        padding-top: 0 !important;
        margin-top: 0 !important;
    }
    
    /* Ensure no black bars anywhere */
    .stApp > div {
        background: transparent !important;
    }
    
    /* Remove iframe borders that might create black areas */
    iframe {
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    
    /* Comprehensive black area removal */
    div[data-testid="stAppViewContainer"] {
        padding-top: 0 !important;
        margin-top: 0 !important;
    }
    
    /* Remove any system bars */
    .stApp .element-container:first-child {
        margin-top: 0 !important;
        padding-top: 0 !important;
    }
    
    section[data-testid="stSidebar"] {
        z-index: 1000 !important;
    }
    
    /* Ensure all text is visible */
    .stMarkdown, .stMarkdown p, .stMarkdown h1, .stMarkdown h2, .stMarkdown h3, .stMarkdown h4 {
        color: var(--text-primary) !important;
    }
    
    /* Accessibility: Focus outlines for all interactive elements */
    button, [tabindex]:not([tabindex="-1"]), input, select, textarea, .stButton > button {
        outline: none;
        transition: box-shadow 0.2s;
    }
    button:focus, [tabindex]:not([tabindex="-1"]):focus, input:focus, select:focus, textarea:focus, .stButton > button:focus {
        outline: var(--focus-outline) !important;
        box-shadow: 0 0 0 3px #00f2fe55 !important;
        z-index: 2;
    }
    
    /* Animated background */
    .main-container {
        position: relative;
        min-height: 100vh;
        background: transparent;
        overflow: visible;
        z-index: 0;
    }
    
    /* Apply background to body instead of main-container */
    body[data-theme="dark"], 
    body[data-theme="dark"] .stApp {
        background: radial-gradient(ellipse at top, #4f46e5 0%, #a21caf 50%, #09090b 100%) !important;
    }
    
    body[data-theme="light"], 
    body[data-theme="light"] .stApp {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #ffffff 100%) !important;
        color: var(--text-primary) !important;
    }
    
    body[data-theme="light"] .main-content {
        color: var(--text-primary) !important;
    }
    
    body[data-theme="light"] h1, 
    body[data-theme="light"] h2, 
    body[data-theme="light"] h3 {
        color: var(--text-primary) !important;
    }
    
    body[data-theme="light"] p,
    body[data-theme="light"] span,
    body[data-theme="light"] div {
        color: var(--text-primary) !important;
    }
    
    .main-container::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: 
            radial-gradient(circle at 20% 80%, #a21caf33 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #4f46e533 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, #00f2fe22 0%, transparent 50%);
        animation: backgroundShift 20s ease-in-out infinite;
        z-index: -1;
        opacity: 1;
    }
    
    body[data-theme="light"] .main-container::before {
        opacity: 0.3;
        background: 
            radial-gradient(circle at 20% 80%, #a21caf11 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #4f46e511 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, #00f2fe11 0%, transparent 50%);
    }
    
    @keyframes backgroundShift {
        0%, 100% { transform: translateX(0) translateY(0) scale(1); }
        33% { transform: translateX(-20px) translateY(-10px) scale(1.05); }
        66% { transform: translateX(20px) translateY(10px) scale(0.95); }
    }
    
    /* Floating particles */
    .particles {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    }
    
    .particle {
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--text-accent);
        border-radius: 50%;
        animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
        10%, 90% { opacity: 1; }
        50% { transform: translateY(-100px) translateX(50px); }
    }
    
    /* Optimized sidebar styling for smooth performance */
    [data-testid="stSidebar"] {
        background: var(--sidebar-bg) !important;
        backdrop-filter: blur(10px) saturate(120%) !important;
        border-right: 1px solid var(--card-border) !important;
        box-shadow: 4px 0 16px rgba(0,0,0,0.08) !important;
        padding: 0 !important;
        position: relative !important;
        will-change: scroll-position !important;
        transform: translateZ(0) !important; /* Enable hardware acceleration */
    }
    
    /* Simplified gradient overlay for better performance */
    [data-testid="stSidebar"]::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        background: linear-gradient(180deg, 
            rgba(79,70,229,0.02) 0%, 
            transparent 50%,
            rgba(79,70,229,0.02) 100%) !important;
        pointer-events: none;
        z-index: -1;
        will-change: transform !important;
    }
        z-index: 0;
    }
    
    [data-testid="stSidebar"] > * {
        position: relative;
        z-index: 1;
    }

    [data-testid="stSidebar"] .stMarkdown {
        padding: 0;
    }
    
    /* Optimized sidebar header for smooth scrolling */
    [data-testid="stSidebar"] > div:first-child {
        padding: 2rem 1.5rem !important;
        border-bottom: 1px solid var(--card-border) !important;
        background: linear-gradient(135deg, 
            rgba(79,70,229,0.05), 
            rgba(162,28,175,0.03)) !important;
        position: relative !important;
        will-change: transform !important;
    }
    
    /* Simplified header animation for performance */
    [data-testid="stSidebar"] > div:first-child::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at center, rgba(79,70,229,0.08) 0%, transparent 60%);
        opacity: 0.5;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }
    
    /* Enhanced navigation section */
    [data-testid="stSidebar"] h3 {
        color: var(--text-primary) !important;
        font-size: 0.8rem !important;
        font-weight: 800 !important;
        text-transform: uppercase !important;
        letter-spacing: 1px !important;
        margin: 1.5rem 1.5rem 1rem 1.5rem !important;
        padding: 0.75rem 0 0.5rem 0 !important;
        border-bottom: 2px solid transparent !important;
        background: linear-gradient(90deg, var(--text-accent), rgba(79,70,229,0.6)) !important;
        background-size: 100% 2px !important;
        background-repeat: no-repeat !important;
        background-position: bottom !important;
        position: relative !important;
    }
    
    /* Glowing text effect */
    [data-testid="stSidebar"] h3::before {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, var(--text-accent), #a21caf);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        filter: blur(1px);
        opacity: 0.7;
    }
    /* Style all sidebar buttons as professional nav items */
    [data-testid="stSidebar"] button {
        background: transparent !important;
        color: var(--text-primary) !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 14px 20px !important;
        margin: 4px 16px !important;
        font-weight: 600 !important;
        font-size: 15px !important;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        text-align: left !important;
        position: relative !important;
        overflow: hidden !important;
        width: calc(100% - 32px) !important;
        min-height: 48px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: flex-start !important;
    }
    
    [data-testid="stSidebar"] button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: var(--primary-gradient) !important;
        transition: left 0.3s ease !important;
        z-index: -1 !important;
        border-radius: 12px !important;
    }
    
    [data-testid="stSidebar"] button:hover,
    [data-testid="stSidebar"] button:focus {
        color: #ffffff !important;
        transform: translateX(4px) !important;
        box-shadow: 0 4px 12px rgba(79,70,229,0.3) !important;
    }
    
    [data-testid="stSidebar"] button:hover::before,
    [data-testid="stSidebar"] button:focus::before {
        left: 0 !important;
    }
    
    /* Light mode sidebar fixes */
    body[data-theme="light"] [data-testid="stSidebar"] {
        background: #ffffff !important;
        border-right: 1px solid #e5e7eb !important;
        box-shadow: 4px 0 20px rgba(0,0,0,0.05) !important;
    }
    
    body[data-theme="light"] [data-testid="stSidebar"] button {
        background: transparent !important;
        color: #374151 !important;
        border: none !important;
    }
    
    body[data-theme="light"] [data-testid="stSidebar"] button:hover,
    body[data-theme="light"] [data-testid="stSidebar"] button:focus {
        background: var(--primary-gradient) !important;
        color: #ffffff !important;
        box-shadow: 0 4px 12px rgba(79,70,229,0.25) !important;
    }
    
    /* Professional toggle styling */
    [data-testid="stSidebar"] .stCheckbox {
        padding: 4px 16px !important;
        margin: 2px 0 !important;
    }
    
    [data-testid="stSidebar"] .stCheckbox > label {
        color: var(--text-primary) !important;
        font-weight: 500 !important;
        font-size: 14px !important;
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
        margin-bottom: 0 !important;
    }
    
    /* Color picker styling */
    [data-testid="stSidebar"] .stColorPicker {
        padding: 4px 16px !important;
        margin: 2px 0 !important;
    }
    
    [data-testid="stSidebar"] .stColorPicker > label {
        color: var(--text-primary) !important;
        font-weight: 500 !important;
        font-size: 14px !important;
        margin-bottom: 4px !important;
    }
    
    /* Toggle buttons light mode */
    body[data-theme="light"] .stCheckbox > label {
        color: var(--text-primary) !important;
    }
    
    body[data-theme="light"] .stSelectbox label,
    body[data-theme="light"] .stNumberInput label {
        color: var(--text-primary) !important;
    }
    
    /* Professional section dividers */
    [data-testid="stSidebar"] hr {
        border: none !important;
        height: 1px !important;
        background: linear-gradient(90deg, transparent, var(--card-border), transparent) !important;
        margin: 1rem 0 !important;
    }
    
    /* Sidebar typography improvements */
    [data-testid="stSidebar"] .stMarkdown h3 {
        font-size: 0.875rem !important;
        font-weight: 700 !important;
        color: var(--text-primary) !important;
        margin: 0.5rem 1rem 0.5rem 1rem !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
    }
    
    /* Professional active page indicator */
    [data-testid="stSidebar"] .active-page-indicator {
        position: absolute !important;
        left: 0 !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        width: 4px !important;
        height: 24px !important;
        background: var(--text-accent) !important;
        border-radius: 0 4px 4px 0 !important;
    }
    
    /* Optimized expander styling for smooth performance */
    [data-testid="stSidebar"] .stExpander {
        border: 1px solid var(--card-border) !important;
        border-radius: 12px !important;
        margin: 0.75rem 16px !important;
        background: rgba(79,70,229,0.02) !important;
        overflow: hidden !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
        backdrop-filter: blur(10px) !important;
        transition: transform 0.2s ease, box-shadow 0.2s ease !important;
        will-change: transform !important;
        transform: translateZ(0) !important; /* Hardware acceleration */
    }
    
    /* Simplified hover effects for better performance */
    [data-testid="stSidebar"] .stExpander:hover {
        transform: translateY(-1px) translateZ(0) !important;
        box-shadow: 0 4px 16px rgba(79,70,229,0.1) !important;
    }
    
    /* Optimized expander header for performance */
    [data-testid="stSidebar"] .stExpander > div:first-child {
        background: rgba(79,70,229,0.05) !important;
        border: none !important;
        padding: 14px 18px !important;
        font-weight: 600 !important;
        font-size: 14px !important;
        color: var(--text-primary) !important;
        border-radius: 12px !important;
        position: relative !important;
        transition: background-color 0.2s ease !important;
        will-change: background-color !important;
    }
    
    [data-testid="stSidebar"] .stExpander > div:first-child:hover {
        background: rgba(79,70,229,0.08) !important;
    }
    
    [data-testid="stSidebar"] .stExpander[data-expanded="true"] > div:first-child {
        border-radius: 12px 12px 0 0 !important;
        border-bottom: 1px solid var(--card-border) !important;
    }
    
    /* Optimized content area */
    [data-testid="stSidebar"] .stExpander > div:last-child {
        padding: 16px !important;
        background: var(--card-bg) !important;
        border-radius: 0 0 12px 12px !important;
        will-change: auto !important;
    }
    
    /* Optimized navigation buttons for smooth scrolling */
    .nav-button {
        background: rgba(79,70,229,0.03) !important;
        color: var(--text-primary) !important;
        border: 1px solid var(--card-border) !important;
        border-radius: 12px !important;
        padding: 14px 24px !important;
        margin: 8px 0 !important;
        font-weight: 600 !important;
        font-size: 16px !important;
        transition: transform 0.2s ease, background-color 0.2s ease !important;
        position: relative !important;
        text-align: left !important;
        width: 100% !important;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
        will-change: transform !important;
        transform: translateZ(0) !important; /* Hardware acceleration */
    }
    
    /* Simplified button hover effects */
    .nav-button:hover {
        background: rgba(79,70,229,0.08) !important;
        transform: translateY(-1px) translateZ(0) !important;
        box-shadow: 0 4px 16px rgba(79,70,229,0.1) !important;
        border-color: rgba(79,70,229,0.2) !important;
    }
    
    /* Simplified active state */
    .nav-button:active {
        transform: translateY(0) translateZ(0) !important;
        box-shadow: 0 2px 8px rgba(79,70,229,0.08) !important;
    }
        letter-spacing: 0.5px;
    }

    .nav-button:focus {
        outline: var(--focus-outline) !important;
        box-shadow: 0 0 0 3px #00f2fe55 !important;
    }

    .nav-button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: var(--primary-gradient);
        transition: left 0.3s ease;
        z-index: -1;
    }

    /* Sidebar footer enhancement */
    [data-testid="stSidebar"] .sidebar-footer {
        margin-top: auto !important;
        padding: 2rem 1.5rem !important;
        border-top: 1px solid var(--card-border) !important;
        background: linear-gradient(0deg, 
            rgba(79,70,229,0.05), 
            rgba(162,28,175,0.03),
            transparent) !important;
        text-align: center !important;
        position: relative !important;
    }
    
    /* Premium footer glow */
    [data-testid="stSidebar"] .sidebar-footer::before {
        content: '';
        position: absolute;
        top: -20px;
        left: 20%;
        right: 20%;
        height: 40px;
        background: radial-gradient(ellipse, rgba(79,70,229,0.2) 0%, transparent 70%);
        filter: blur(10px);
    }
    
    /* Optimized scrollbar for smooth performance */
    [data-testid="stSidebar"] *::-webkit-scrollbar {
        width: 4px;
    }
    
    [data-testid="stSidebar"] *::-webkit-scrollbar-track {
        background: rgba(79,70,229,0.03);
        border-radius: 4px;
    }
    
    [data-testid="stSidebar"] *::-webkit-scrollbar-thumb {
        background: rgba(79,70,229,0.3);
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }
    
    [data-testid="stSidebar"] *::-webkit-scrollbar-thumb:hover {
        background: rgba(79,70,229,0.5);
    }
    
    /* Performance optimization for smooth scrolling */
    [data-testid="stSidebar"] {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
    }
    
    [data-testid="stSidebar"] * {
        scroll-behavior: smooth;
    }
    
    /* Additional performance optimizations */
    [data-testid="stSidebar"] *,
    [data-testid="stSidebar"] *::before,
    [data-testid="stSidebar"] *::after {
        will-change: auto !important;
        backface-visibility: hidden !important;
        perspective: 1000px !important;
    }
    
    /* Reduce motion for better performance */
    @media (prefers-reduced-motion: reduce) {
        [data-testid="stSidebar"] * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
    
    /* Main content area - Minimized spacing */
    .main-content {
        padding: 1rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
        background: transparent;
        color: var(--text-primary);
        flex: 1;
        position: relative;
        z-index: 10;
        overflow-y: auto;
        min-height: 0;
        height: 100%;
        box-sizing: border-box;
    }
    
    .main-container { 
        padding-top: 0px; 
        background: transparent;
        min-height: 100vh;
        max-height: 100vh;
        position: relative;
        z-index: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    /* Hero banner */
    .hero {
        position: relative;
        background: linear-gradient(135deg, rgba(79,70,229,0.1), rgba(162,28,175,0.1));
        border: 1px solid var(--card-border);
        border-radius: 20px;
        padding: 2rem;
        overflow: hidden;
        backdrop-filter: blur(10px);
    }
    
    body[data-theme="dark"] .hero {
        background: linear-gradient(135deg, rgba(79,70,229,0.2), rgba(162,28,175,0.2));
    }
    
    .hero h1 { margin-bottom: 0.5rem !important; }
    .hero p { 
        color: var(--text-secondary); 
        margin: 0.5rem 0 0 0; 
        font-size: 1.1rem; 
        font-weight: 500;
        line-height: 1.6;
    }
    .hero::after {
        content: '';
        position: absolute;
        right: -40px; top: -40px;
        width: 220px; height: 220px;
        background: radial-gradient(circle, var(--text-accent)22, transparent 60%);
        filter: blur(8px);
    }
    /* Footer - Minimized spacing */
    .app-footer {
        position: sticky;
        bottom: 0;
        margin-top: 0.5rem;
        background: var(--surface-weak);
        border: 1px solid var(--card-border);
        border-radius: 12px;
        padding: 0.5rem 1rem;
        color: var(--text-secondary);
        font-size: 0.85rem;
    }
    
    /* Headers */
    h1 {
        font-weight: 800 !important;
        font-size: 3rem !important;
        background: var(--primary-gradient) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
        margin: 0 0 1rem 0 !important;
        display: flex !important;
        align-items: center !important;
        animation: titleGlow 3s ease-in-out infinite alternate !important;
    }
    
    @keyframes titleGlow {
        from { filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.5)); }
        to { filter: drop-shadow(0 0 20px rgba(102, 126, 234, 0.8)); }
    }
    
    h1 svg {
        width: 48px !important;
        height: 48px !important;
        margin-right: 20px !important;
        fill: url(#primaryGradient) !important;
        animation: iconPulse 2s ease-in-out infinite !important;
    }
    
    @keyframes iconPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    h2 {
        font-weight: 700 !important;
        color: var(--text-primary) !important;
        margin: 2rem 0 1rem 0 !important;
        font-size: 2rem !important;
    }
    
    h3 {
        font-weight: 600 !important;
        color: var(--text-primary) !important;
        margin: 1.5rem 0 0.5rem 0 !important;
        font-size: 1.5rem !important;
    }
    
    /* Cards */
    .glass-card {
        background: var(--card-bg) !important;
        backdrop-filter: blur(20px) !important;
        border: 1px solid var(--card-border) !important;
        border-radius: 20px !important;
        padding: 2rem !important;
        box-shadow: var(--shadow-card) !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        position: relative !important;
        overflow: hidden !important;
        animation: cardSlideIn 0.6s ease-out !important;
    }
    
    @keyframes cardSlideIn {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
    
    .glass-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: var(--primary-gradient);
        opacity: 0.6;
    }
    
    .glass-card:hover {
        transform: translateY(-5px) !important;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
        border-color: rgba(102, 126, 234, 0.3) !important;
    }
    
    /* Metric cards */
    .metric-card {
        background: var(--card-bg) !important;
        backdrop-filter: blur(20px) !important;
        border: 1px solid var(--card-border) !important;
        border-radius: 16px !important;
        padding: 1.5rem !important;
        text-align: center !important;
        transition: all 0.3s ease !important;
        position: relative !important;
        overflow: hidden !important;
    }
    
    .metric-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--primary-gradient);
    }
    
    .metric-card:hover {
        transform: translateY(-8px) !important;
        box-shadow: var(--shadow-glow) !important;
    }
    
    .metric-card h4 {
        color: var(--text-secondary) !important;
        font-size: 0.9rem !important;
        font-weight: 500 !important;
        margin: 0 0 0.5rem 0 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
    }
    
    .metric-card h2 {
        color: var(--text-primary) !important;
        font-size: 2.5rem !important;
        font-weight: 800 !important;
        margin: 0 0 0.5rem 0 !important;
        background: var(--primary-gradient) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
    }
    
    .metric-card p {
        color: var(--text-secondary) !important;
        font-size: 0.85rem !important;
        margin: 0 !important;
    }
    
    /* Form elements */
    [data-testid="stSelectbox"] > div > div,
    [data-testid="stNumberInput"] > div > div {
        background: var(--card-bg) !important;
        border: 1px solid var(--card-border) !important;
        border-radius: 12px !important;
        color: var(--text-primary) !important;
        transition: all 0.3s ease !important;
    }
    
    [data-testid="stSelectbox"] > div > div:focus-within,
    [data-testid="stNumberInput"] > div > div:focus-within {
        border-color: #667eea !important;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
    }
    
    /* Fix input field text visibility in light mode */
    body[data-theme="light"] [data-testid="stNumberInput"] input {
        color: var(--text-primary) !important;
        background: var(--card-bg) !important;
    }
    
    /* Fix selectbox text visibility in light mode */
    body[data-theme="light"] [data-testid="stSelectbox"] > div > div {
        color: var(--text-primary) !important;
        background: var(--card-bg) !important;
    }
    
    /* Fix all buttons in light mode */
    body[data-theme="light"] .stButton > button {
        color: var(--text-primary) !important;
        background: var(--card-bg) !important;
        border: 1px solid var(--card-border) !important;
    }
    
    body[data-theme="light"] .stButton > button:hover {
        background: var(--surface-weak) !important;
        color: var(--text-primary) !important;
    }
    
    /* Primary buttons - more prominent, accessible */
    .stButton > button[kind="primary"] {
        background: var(--primary-gradient) !important;
        color: #fff !important;
        border: none !important;
        border-radius: 16px !important;
        padding: 18px 36px !important;
        font-weight: 700 !important;
        font-size: 16px !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        position: relative !important;
        overflow: hidden !important;
        text-transform: none !important;
        letter-spacing: 0.5px;
        outline: none !important;
        box-shadow: var(--shadow-card) !important;
        min-height: 56px !important;
    }
    .stButton > button[kind="primary"]:hover, .stButton > button[kind="primary"]:focus {
        background: var(--secondary-gradient) !important;
        color: #fff !important;
        box-shadow: var(--shadow-glow) !important;
        outline: none !important;
        transform: translateY(-2px) !important;
    }
    /* Ultimate Button System Enhancement */
    .stButton > button[kind="primary"]:active {
        transform: translateY(1px) scale(0.98) !important;
        box-shadow: 0 4px 16px rgba(79,70,229,0.2) !important;
    }
    
    /* Enhanced Regular Buttons */
    .stButton > button {
        background: var(--card-bg) !important;
        color: var(--text-primary) !important;
        border: 2px solid var(--card-border) !important;
        border-radius: 12px !important;
        padding: 14px 28px !important;
        font-weight: 600 !important;
        font-family: 'Inter', sans-serif !important;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        min-height: 48px !important;
        position: relative !important;
        overflow: hidden !important;
        backdrop-filter: blur(10px) !important;
        box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
    }
    
    .stButton > button::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(79,70,229,0.1), transparent);
        transition: left 0.5s ease;
    }
    
    .stButton > button:hover::before {
        left: 100%;
    }
    
    .stButton > button:hover {
        background: var(--surface-weak) !important;
        color: var(--text-primary) !important;
        border-color: var(--text-accent) !important;
        transform: translateY(-1px) !important;
    }
    
    /* Loading spinner */
    .loading-spinner {
        display: inline-block;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: var(--text-accent);
        animation: spin 1s ease-in-out infinite;
        margin-right: 10px;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    /* Success/Error states */
    .success-card {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%) !important;
        border: 1px solid rgba(34, 197, 94, 0.3) !important;
    }
    
    .error-card {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%) !important;
        border: 1px solid rgba(239, 68, 68, 0.3) !important;
    }
    
    /* Tech badges */
    .tech-badges img {
        margin: 8px !important;
        transition: all 0.3s ease !important;
        border-radius: 8px !important;
        filter: grayscale(0.3) !important;
    }
    
    .tech-badges img:hover {
        transform: scale(1.1) translateY(-2px) !important;
        filter: grayscale(0) !important;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .main-content {
            padding: 0.5rem;
        }
        h1 {
            font-size: 1.5rem !important;
        }
        h1 svg {
            width: 28px !important;
            height: 28px !important;
        }
        .glass-card {
            padding: 1rem !important;
        }
        .metric-card h2 {
            font-size: 1.3rem !important;
        }
        .nav-button {
            font-size: 14px !important;
            padding: 10px 10px !important;
        }
        .stButton > button[kind="primary"] {
            font-size: 15px !important;
            padding: 12px 10px !important;
        }
    }
    /* Compact mode adjustments */
    body[data-compact="true"] .glass-card { padding: 1.25rem !important; }
    body[data-compact="true"] .metric-card { padding: 1rem !important; }
    body[data-compact="true"] .stButton > button[kind="primary"] { padding: 12px 16px !important; font-size: 16px !important; }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }
    
    ::-webkit-scrollbar-track {
        background: var(--scrollbar-track);
    }
    
    ::-webkit-scrollbar-thumb {
        background: var(--primary-gradient);
        border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
        background: var(--secondary-gradient);
    }
    
    /* Animation delays for staggered effects */
    .glass-card:nth-child(1) { animation-delay: 0.1s; }
    .glass-card:nth-child(2) { animation-delay: 0.2s; }
    .glass-card:nth-child(3) { animation-delay: 0.3s; }
    .glass-card:nth-child(4) { animation-delay: 0.4s; }
    """
    st.markdown(f"<style>{custom_css}</style>", unsafe_allow_html=True)

def apply_runtime_theme_attributes():
    """Apply runtime attributes on the top-level document for theme, compact mode, and accent color."""
    theme = st.session_state.get('theme', 'dark')
    compact = 'true' if st.session_state.get('compact_mode', False) else 'false'
    accent = st.session_state.get('accent_color', '#00f2fe')
    components.html(f"""
        <style>
            :root {{ --text-accent: {accent}; }}
        </style>
        <script>
            try {{
                var body = parent.document.body;
                body.setAttribute('data-theme', '{theme}');
                body.setAttribute('data-compact', '{compact}');
            }} catch (e) {{}}
        </script>
    """, height=0)

# --- Caching Data Generation Functions ---
@st.cache_data
def generate_volume_chart():
    df_chains = pd.DataFrame({'Chain': ['Polygon', 'Arbitrum', 'Optimism', 'Base', 'Ethereum'],'Volume (Millions)': [450, 320, 210, 150, 90]})
    current_theme = st.session_state.get('theme', 'dark')
    font_color = "#0f172a" if current_theme == 'light' else "#ffffff"
    grid_color = "rgba(15, 23, 42, 0.1)" if current_theme == 'light' else "rgba(255, 255, 255, 0.1)"
    fig = go.Figure(data=[go.Bar(x=df_chains['Chain'], y=df_chains['Volume (Millions)'], marker_color=['#A770EF', '#CF8BF3', '#FDB99B', '#A770EF', '#CF8BF3'])])
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        font_color=font_color,
        xaxis=dict(gridcolor=grid_color),
        yaxis=dict(gridcolor=grid_color),
        margin=dict(l=20, r=20, t=20, b=20)
    )
    return fig

@st.cache_data
def generate_token_pie_chart():
    df_tokens = pd.DataFrame({'Token': ['USDC', 'ETH', 'USDT', 'WBTC', 'Other'], 'Percentage': [55, 25, 12, 5, 3]})
    current_theme = st.session_state.get('theme', 'dark')
    font_color = "#0f172a" if current_theme == 'light' else "#ffffff"
    fig = go.Figure(data=[go.Pie(labels=df_tokens['Token'], values=df_tokens['Percentage'], hole=.4, marker_colors=['#A770EF', '#CF8BF3', '#FDB99B', '#8A2BE2', '#4B0082'])])
    fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', font_color=font_color, legend_orientation="h", margin=dict(l=20, r=20, t=20, b=20))
    return fig

# --- Page Rendering Functions ---
def render_dashboard():
    # Wrap dashboard content in a proper container
    st.markdown('<div style="display: flex; flex-direction: column; background: var(--app-bg);">', unsafe_allow_html=True)
    
    # Optional ambient particles
    if st.session_state.get('ambient', True):
        st.markdown("""
        <div class="particles" id="particles"></div>
        <script>
            function createParticles() {
                const container = document.getElementById('particles');
                if (!container) return;
                container.innerHTML = ''; // Clear existing particles
                const particleCount = window.innerWidth < 768 ? 30 : 50;
                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    particle.style.left = Math.random() * 100 + '%';
                    particle.style.top = Math.random() * 100 + '%';
                    particle.style.animationDelay = Math.random() * 6 + 's';
                    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                    container.appendChild(particle);
                }
            }
            createParticles();
            // Recreate on resize
            window.addEventListener('resize', createParticles);
        </script>
        """, unsafe_allow_html=True)

    # Hero header with enhanced accessibility
    st.markdown("""
    <div class="hero" role="banner">
        <h1>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48" aria-hidden="true">
                <defs>
                    <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <path d="M3 13H5V11H3V13ZM3 17H5V15H3V17ZM3 9H5V7H3V9ZM7 13H17V11H7V13ZM7 17H17V15H7V17ZM7 9H17V7H7V9ZM19 13H21V11H19V13ZM19 17H21V15H19V17ZM19 9H21V7H19V9ZM3 21H5V19H3V21ZM7 21H17V19H7V21ZM19 21H21V19H19V21ZM3 5H5V3H3V5ZM7 5H17V3H7V5ZM19 5H21V3H19V5Z" fill="url(#primaryGradient)"></path>
            </svg>
            Analytics Dashboard
        </h1>
        <p>Real-time cross-chain intelligence with AI-enhanced insights and professional-grade analytics.</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <div class="glass-card" style="margin: 1.5rem 0 2rem 0;">
        <p style="font-size: 1.1rem; color: var(--text-secondary); margin: 0; line-height: 1.8; font-weight: 500;">
            🚀 Welcome to ChainCompass AI Suite — your enterprise-grade command center for monitoring cross-chain swap volumes, token analytics, and real-time transaction flows across multiple blockchain networks.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("### 📊 Key Metrics")
    
    # Enhanced metrics with better styling
    m1, m2, m3, m4 = st.columns(4)
    with m1: 
        st.markdown('''
        <div class="metric-card">
            <h4>Total Value Swapped</h4>
            <h2>$1.2B</h2>
            <p style="color: #22c55e;">+2.5% last 24h</p>
        </div>
        ''', unsafe_allow_html=True)
    with m2: 
        st.markdown('''
        <div class="metric-card">
            <h4>Transactions (24h)</h4>
            <h2>15,203</h2>
            <p style="color: #ef4444;">-1.8% vs yesterday</p>
        </div>
        ''', unsafe_allow_html=True)
    with m3: 
        st.markdown('''
        <div class="metric-card">
            <h4>Avg. Swap Time</h4>
            <h2>85s</h2>
            <p style="color: #22c55e;">-12% faster</p>
        </div>
        ''', unsafe_allow_html=True)
    with m4: 
        st.markdown('''
        <div class="metric-card">
            <h4>Supported Chains</h4>
            <h2>12</h2>
            <p style="color: var(--text-accent);">+2 new integrations</p>
        </div>
        ''', unsafe_allow_html=True)
    
    # Enhanced charts section
    st.markdown("### 📈 Market Analytics")
    c1, c2 = st.columns(2)
    with c1:
        st.markdown('<div class="glass-card">', unsafe_allow_html=True)
        st.markdown("#### 🔗 Swap Volume by Chain")
        st.plotly_chart(generate_volume_chart(), use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)
    with c2:
        st.markdown('<div class="glass-card">', unsafe_allow_html=True)
        st.markdown("#### 🪙 Popular Token Swaps")
        st.plotly_chart(generate_token_pie_chart(), use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)
    
    # Add real-time activity section
    st.markdown("### ⚡ Live Activity Feed")
    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    
    # Simulate real-time data
    import random
    from datetime import datetime, timedelta
    
    activity_data = []
    for i in range(5):
        chains = ['Polygon', 'Arbitrum', 'Optimism', 'Base', 'Ethereum']
        tokens = ['USDC', 'ETH', 'USDT', 'WBTC']
        amounts = ['$1,250', '$5,600', '$890', '$12,400', '$3,200']
        
        activity_data.append({
            'time': (datetime.now() - timedelta(minutes=random.randint(1, 30))).strftime('%H:%M'),
            'chain': random.choice(chains),
            'token': random.choice(tokens),
            'amount': random.choice(amounts),
            'status': 'Completed'
        })
    
    for activity in activity_data:
        st.markdown(f"""
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; margin: 0.5rem 0; background: var(--surface-weak); border-radius: 8px; border-left: 3px solid var(--text-accent);">
            <div>
                <strong>{activity['amount']}</strong> {activity['token']} on <strong>{activity['chain']}</strong>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <span style="color: var(--text-secondary); font-size: 0.9rem;">{activity['time']}</span>
                <span style="color: #22c55e; font-size: 0.8rem; background: var(--surface-weak); padding: 0.25rem 0.5rem; border-radius: 4px;">{activity['status']}</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    # Close activity card and add minimal spacing
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Close dashboard container
    st.markdown('</div>', unsafe_allow_html=True)

def render_swap_ai():
    st.markdown("""
    <div class="hero">
        <h1>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                <defs>
                    <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <path d="M19.964 12.032c.024.314.036.63.036.952 0 4.41-3.586 8.016-8 8.016-4.41 0-8-3.605-8-8.016 0-3.352 2.06-6.234 5-7.44V2.558C4.582 3.96 1.964 7.64 1.964 12c0 5.514 4.486 10.016 10 10.016s10-4.502 10-10.016c0-.31-.013-.617-.036-.92L19.964 12.032zM12 0C9.794 0 8 1.79 8 4s1.794 4 4 4 4-1.79 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm-4 4.016c-3.309 0-6 2.691-6 6v1.984h12v-1.984c0-3.309-2.691-6-6-6zm0 2c2.206 0 4 1.794 4 4v.016H4v-.016c0-2.206 1.794-4 4-4z" fill="url(#aiGradient)"></path>
            </svg>
            Swap AI Assistant
        </h1>
        <p>AI-optimized routes across chains, DEXs, and bridges—get the best rate, time, and fees.</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <div class="glass-card" style="margin-bottom: 2rem;">
        <p style="font-size: 1.1rem; color: var(--text-secondary); margin: 0; line-height: 1.6;">
            Your intelligent guide for finding the optimal cross-chain swap routes. Our AI analyzes multiple DEXs and bridges to find the best rates, lowest fees, and fastest execution times.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Enhanced swap form
    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    st.markdown("#### 🔄 Configure Your Swap")
    
    CHAINS = {
        "Polygon": {"code": "POL", "icon": "🟣", "color": "#8247e5"},
        "Arbitrum": {"code": "ARB", "icon": "🔵", "color": "#28a0f0"},
        "Ethereum": {"code": "ETH", "icon": "⚫", "color": "#627eea"},
        "Optimism": {"code": "OPT", "icon": "🔴", "color": "#ff0420"},
        "Base": {"code": "BASE", "icon": "🔷", "color": "#0052ff"}
    }
    
    TOKENS = {
        "USDC": {"code": "USDC", "icon": "💵", "decimals": 6},
        "Ethereum": {"code": "ETH", "icon": "Ξ", "decimals": 18},
        "Tether": {"code": "USDT", "icon": "💸", "decimals": 6},
        "Wrapped BTC": {"code": "WBTC", "icon": "₿", "decimals": 8}
    }
    
    # Chain selection with visual indicators
    col1, col2 = st.columns(2)
    with col1:
        st.markdown("**From Chain**")
        from_chain_name = st.selectbox(
            "Select source blockchain", 
            options=list(CHAINS.keys()), 
            key="from_chain", 
            label_visibility="collapsed"
        )
        if from_chain_name:
            chain_info = CHAINS[from_chain_name]
            st.markdown(f"""
            <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; 
                       background: var(--surface-medium); border-radius: 8px; margin-top: 0.5rem;">
                <span style="font-size: 1.5rem;">{chain_info['icon']}</span>
                <span style="color: {chain_info['color']}; font-weight: 600;">{from_chain_name}</span>
            </div>
            """, unsafe_allow_html=True)
        
        st.markdown("**Token to Swap**")
        from_token_name = st.selectbox(
            "Select token to swap", 
            options=list(TOKENS.keys()), 
            key="from_token", 
            label_visibility="collapsed"
        )
        if from_token_name:
            token_info = TOKENS[from_token_name]
            st.markdown(f"""
            <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: var(--surface-medium); border-radius: 8px; margin-top: 0.5rem;">
                <span style="font-size: 1.2rem;">{token_info['icon']}</span>
                <span style="font-weight: 600;">{from_token_name}</span>
            </div>
            """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("**To Chain**")
        to_chain_name = st.selectbox(
            "Select destination blockchain", 
            options=list(CHAINS.keys()), 
            index=1, 
            key="to_chain", 
            label_visibility="collapsed"
        )
        if to_chain_name:
            chain_info = CHAINS[to_chain_name]
            st.markdown(f"""
            <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; 
                       background: var(--surface-medium); border-radius: 8px; margin-top: 0.5rem;">
                <span style="font-size: 1.5rem;">{chain_info['icon']}</span>
                <span style="color: {chain_info['color']}; font-weight: 600;">{to_chain_name}</span>
            </div>
            """, unsafe_allow_html=True)
        
        st.markdown("**Token to Receive**")
        to_token_name = st.selectbox(
            "Select token to receive", 
            options=list(TOKENS.keys()), 
            index=1, 
            key="to_token", 
            label_visibility="collapsed"
        )
        if to_token_name:
            token_info = TOKENS[to_token_name]
            st.markdown(f"""
            <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: var(--surface-medium); border-radius: 8px; margin-top: 0.5rem;">
                <span style="font-size: 1.2rem;">{token_info['icon']}</span>
                <span style="font-weight: 600;">{to_token_name}</span>
            </div>
            """, unsafe_allow_html=True)
    
    # Quick amount buttons
    st.markdown("**Quick Amounts**")
    quick_cols = st.columns(5)
    quick_amounts = [50.0, 100.0, 500.0, 1000.0, 5000.0]
    for i, amount in enumerate(quick_amounts):
        with quick_cols[i]:
            if st.button(f"${amount}", key=f"quick_{amount}", use_container_width=True):
                st.session_state["desired_amount"] = float(amount)
                st.rerun()

    # Enhanced amount input with validation
    st.markdown("**Amount to Swap**")
    from_amount_display = st.number_input(
        f"Enter amount of {from_token_name} to swap", 
        value=float(st.session_state.get("desired_amount", 100.0)), 
        min_value=0.01, 
        max_value=1000000.0,  # Add reasonable maximum
        step=10.0,
        key="amount_input_widget",
        label_visibility="collapsed",
        help=f"Minimum: 0.01 {from_token_name} | Maximum: 1,000,000 {from_token_name}"
    )
    
    # Input validation with user feedback
    if from_amount_display <= 0:
        st.warning("⚠️ Please enter a positive amount greater than 0.")
    elif from_amount_display > 1000000:
        st.error("🚨 Amount exceeds maximum limit of 1,000,000 tokens.")
    else:
        # Show estimated USD value (mock calculation for demo)
        estimated_usd = from_amount_display * 1.0  # Mock price
        st.info(f"💰 Estimated Value: ~${estimated_usd:,.2f} USD")
    
    # Enhanced swap button with professional loading state
    if st.button("🚀 Find Best Route", type="primary", use_container_width=True, 
                help="Analyze optimal routes across 50+ DEXs and bridges using AI"):
        st.session_state.result = None
        st.session_state.loading = True
        response = None
        
        # Professional loading animation with detailed progress
        progress_container = st.container()
        with progress_container:
            progress_bar = st.progress(0)
            status_text = st.empty()
            
            loading_states = [
                (0.1, "🔍 Initializing route analysis..."),
                (0.2, "🌐 Scanning blockchain networks..."),
                (0.4, "� Analyzing DEX liquidity pools..."),
                (0.6, "🌉 Evaluating bridge protocols..."),
                (0.8, "🧠 AI optimizing route selection..."),
                (0.9, "✨ Finalizing best route...")
            ]
        
        try:
            for progress, message in loading_states:
                status_text.text(message)
                progress_bar.progress(progress)
                time.sleep(0.3)
            
            api_url = f"{API_BASE_URL.rstrip('/')}/api/v1/quote"
            decimals = TOKENS[from_token_name]["decimals"]
            params = { 
                "fromChain": CHAINS[from_chain_name]["code"], 
                "toChain": CHAINS[to_chain_name]["code"], 
                "fromToken": TOKENS[from_token_name]["code"], 
                "toToken": TOKENS[to_token_name]["code"], 
                "fromAmount": str(int(from_amount_display * (10**decimals))) 
            }
            
            status_text.text("🌐 Querying cross-chain bridges...")
            progress_bar.progress(0.3)
            time.sleep(0.3)
            
            status_text.text("📊 Analyzing DEX liquidity...")
            progress_bar.progress(0.6)
            
            response = requests.get(api_url, params=params, timeout=60)
            progress_bar.progress(0.9)
            
            response.raise_for_status()
            st.session_state.result = response.json()
            st.session_state.loading = False
            
            progress_bar.progress(1.0)
            status_text.text("✅ Analysis complete!")
            time.sleep(0.5)
            progress_bar.empty()
            status_text.empty()
            
        except requests.exceptions.HTTPError as http_err:
            progress_bar.empty()
            status_text.empty()
            err_json = {}
            if response is not None:
                try:
                    err_json = response.json()
                except Exception:
                    err_json = {"details": response.text}
                st.session_state.result = {"error": "Failed to fetch quote", **err_json, "status_code": response.status_code}
            else:
                st.session_state.result = {"error": "Failed to fetch quote", "details": str(http_err)}
            st.session_state.loading = False
        except requests.exceptions.Timeout:
            progress_bar.empty()
            status_text.empty()
            st.session_state.result = {"error": "Request timed out", "details": "The request took too long. Please try again."}
            st.session_state.loading = False
        except Exception as e:
            progress_bar.empty()
            status_text.empty()
            st.session_state.result = {"error": "An unexpected error occurred", "details": str(e)}
            st.session_state.loading = False
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Enhanced results display
    if 'result' in st.session_state and st.session_state.result:
        result = st.session_state.result
        if result.get("error"):
            st.markdown('<div class="glass-card error-card" style="margin-top: 2rem;">', unsafe_allow_html=True)
            st.markdown("#### ⚠️ Error")
            st.markdown(f"**{result.get('error')}**")
            if result.get("details"):
                with st.expander("🔍 Technical Details"):
                    st.code(str(result.get("details")))
            st.markdown('</div>', unsafe_allow_html=True)
        else:
            st.markdown('<div class="glass-card success-card" style="margin-top: 2rem;">', unsafe_allow_html=True)
            st.markdown("#### 🏆 AI Recommendation")
            st.markdown(f"""
            <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%); padding: 1.5rem; border-radius: 12px; border: 1px solid rgba(34, 197, 94, 0.3);">
                <p style="font-size: 1.1rem; line-height: 1.6; margin: 0; color: var(--text-primary);">
                    {result.get("summary", "")}
                </p>
            </div>
            """, unsafe_allow_html=True)
            st.markdown('</div>', unsafe_allow_html=True)

def render_about_page():
    st.markdown("""
    <h1>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
            <defs>
                <linearGradient id="aboutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                </linearGradient>
            </defs>
            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" fill="url(#aboutGradient)"></path>
        </svg>
        About ChainCompass AI
    </h1>
    """, unsafe_allow_html=True)
    
    # Mission section
    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    st.markdown("#### 🎯 Our Mission")
    st.markdown("""
    <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-secondary);">
        ChainCompass AI revolutionizes cross-chain DeFi by making complex token swaps simple, secure, and intelligent. 
        We bridge the gap between multiple blockchain networks, providing users with the best routes, lowest fees, 
        and fastest execution times through advanced AI analysis.
    </p>
    """, unsafe_allow_html=True)
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Developer section
    col1, col2 = st.columns([1, 2])
    with col1:
        st.markdown('<div class="glass-card">', unsafe_allow_html=True)
        st.markdown(get_logo_as_html(width="120px"), unsafe_allow_html=True) 
        st.markdown("<h3 style='text-align: center; color: var(--text-primary);'>Krishnav Mahajan</h3>", unsafe_allow_html=True)
        st.markdown("<p style='text-align: center; color: var(--text-accent); font-weight: 600;'>Lead Developer & AI Engineer</p>", unsafe_allow_html=True)
        st.markdown("""
        <div style="text-align: center; margin-top: 1rem;">
            <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">
                Full-stack developer specializing in DeFi protocols, AI integration, and blockchain technology. 
                Passionate about creating user-friendly solutions for complex financial systems.
            </p>
        </div>
        """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col2:
        st.markdown('<div class="glass-card">', unsafe_allow_html=True)
        st.markdown("#### 🛠️ Technology Stack")
        st.markdown("""
        <div class="tech-badges">
            <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
            <img src="https://img.shields.io/badge/Streamlit-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white" alt="Streamlit">
            <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
            <img src="https://img.shields.io/badge/LangChain-182333?style=for-the-badge&logo=langchain&logoColor=white" alt="LangChain">
            <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI">
            <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render">
            <img src="https://img.shields.io/badge/Plotly-3F4F75?style=for-the-badge&logo=plotly&logoColor=white" alt="Plotly">
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("#### 🚀 Key Features")
        features = [
            "🤖 AI-Powered Route Optimization",
            "🔗 Multi-Chain Support (12+ Networks)",
            "⚡ Real-Time Market Analysis", 
            "💰 Lowest Fee Discovery",
            "🛡️ Secure & Trustless Swaps",
            "📊 Advanced Analytics Dashboard"
        ]
        
        for feature in features:
            st.markdown(f"""
            <div style="display: flex; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <span style="font-size: 1.2rem; margin-right: 0.75rem;">{feature.split(' ')[0]}</span>
                <span style="color: var(--text-primary);">{' '.join(feature.split(' ')[1:])}</span>
            </div>
            """, unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)
    
    # Stats section
    st.markdown("#### 📈 Project Statistics")
    stats_cols = st.columns(4)
    stats = [
        {"label": "Supported Chains", "value": "12+", "icon": "🔗"},
        {"label": "DEXs Integrated", "value": "50+", "icon": "🏪"},
        {"label": "AI Models", "value": "3", "icon": "🧠"},
        {"label": "Uptime", "value": "99.9%", "icon": "⚡"}
    ]
    
    for i, stat in enumerate(stats):
        with stats_cols[i]:
            st.markdown(f"""
            <div class="metric-card">
                <div style="font-size: 2rem; margin-bottom: 0.5rem;">{stat['icon']}</div>
                <h2>{stat['value']}</h2>
                <h4>{stat['label']}</h4>
            </div>
            """, unsafe_allow_html=True)

# --- Main App Router ---
def main():
    apply_custom_styling()
    apply_runtime_theme_attributes()
    
    # Remove any top spacing by adding content immediately
    st.markdown('<div style="height: 0; margin: 0; padding: 0;"></div>', unsafe_allow_html=True)
    
    # Create professional sidebar with proper container
    with st.sidebar:
        # Add professional sidebar container wrapper
        st.markdown('<div class="professional-sidebar">', unsafe_allow_html=True)
        
        # Professional logo and branding section
        st.markdown('''
        <div style="text-align: center; padding: 2rem 1.5rem; 
                   background: linear-gradient(135deg, rgba(79,70,229,0.08), rgba(162,28,175,0.08), rgba(0,242,254,0.05));
                   border-bottom: 1px solid var(--card-border); 
                   border-radius: 16px 16px 0 0;
                   position: relative; overflow: hidden;">
            <div style="position: relative; z-index: 2;">
        ''', unsafe_allow_html=True)
        
        st.markdown(get_logo_as_html(width="90px"), unsafe_allow_html=True)
        st.markdown('''
            <h2 style="margin: 1rem 0 0.5rem 0; color: var(--text-primary); 
                      font-size: 1.25rem; font-weight: 800; letter-spacing: 0.5px;
                      background: linear-gradient(135deg, var(--text-accent), #a21caf);
                      -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ChainCompass AI
            </h2>
            <p style="margin: 0; color: var(--text-secondary); 
                     font-size: 0.9rem; font-weight: 600; opacity: 0.8;">
                Professional DeFi Suite
            </p>
            </div>
        </div>
        ''', unsafe_allow_html=True)
        
        # Theme Controls Section - Collapsible
        with st.expander("⚙️ Settings", expanded=False):
            # Theme toggle
            if 'theme' not in st.session_state:
                st.session_state.theme = 'dark'
            if 'ambient' not in st.session_state:
                st.session_state.ambient = True
            if 'compact_mode' not in st.session_state:
                st.session_state.compact_mode = False
            if 'accent_color' not in st.session_state:
                st.session_state.accent_color = '#00f2fe'
            theme_choice = st.toggle("Light mode", value=(st.session_state.theme == 'light'))
            st.session_state.theme = 'light' if theme_choice else 'dark'
            st.session_state.ambient = st.toggle("Ambient effects", value=st.session_state.ambient)
            st.session_state.compact_mode = st.toggle("Compact mode", value=st.session_state.compact_mode)
            st.session_state.accent_color = st.color_picker("Accent color", value=st.session_state.accent_color, help="Customize highlight color")
            apply_runtime_theme_attributes()
        
        # Professional Navigation Section
        st.markdown('''
        <div style="padding: 1.5rem 0 1rem 0;">
            <h3 style="color: var(--text-primary); font-size: 0.8rem; font-weight: 800; 
                      text-transform: uppercase; letter-spacing: 1px; 
                      margin: 0 1.5rem 1.5rem 1.5rem; padding: 0.75rem 0 0.5rem 0;
                      background: linear-gradient(90deg, var(--text-accent), rgba(79,70,229,0.6));
                      background-size: 100% 2px; background-repeat: no-repeat; 
                      background-position: bottom; position: relative;">
                🧭 Navigation
            </h3>
        </div>
        ''', unsafe_allow_html=True)
        
        pages = {
            "Dashboard": {"icon": "📊", "desc": "Analytics & Overview"},
            "Swap AI": {"icon": "🤖", "desc": "AI-Powered Swaps"}, 
            "About": {"icon": "ℹ️", "desc": "Project Information"}
        }
        
        if 'active_page' not in st.session_state:
            st.session_state.active_page = "Dashboard"

        # Enhanced navigation with premium styling
        for page, info in pages.items():
            is_active = (page == st.session_state.active_page)
            
            # Apply professional nav-button class styling
            button_html = f"""
            <style>
                .nav-btn-{page.lower().replace(' ', '-')} {{
                    background: linear-gradient(135deg, rgba(79,70,229,0.05), rgba(162,28,175,0.03), rgba(0,242,254,0.02)) !important;
                    border: 1px solid var(--card-border) !important;
                    border-radius: 16px !important;
                    padding: 16px 24px !important;
                    margin: 8px 16px !important;
                    width: calc(100% - 32px) !important;
                    text-align: left !important;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                    position: relative !important;
                    overflow: hidden !important;
                }}
                .nav-btn-{page.lower().replace(' ', '-')}:hover {{
                    transform: translateY(-2px) scale(1.02) !important;
                    box-shadow: 0 8px 32px rgba(79,70,229,0.2), 0 4px 16px rgba(162,28,175,0.15) !important;
                    border-color: rgba(79,70,229,0.3) !important;
                    background: linear-gradient(135deg, rgba(79,70,229,0.12), rgba(162,28,175,0.08), rgba(0,242,254,0.06)) !important;
                }}
            </style>
            """
            st.markdown(button_html, unsafe_allow_html=True)
            
            if st.button(f"{info['icon']} {page}", key=f"nav_{page}", use_container_width=True):
                st.session_state.active_page = page
                st.rerun()
            # Show active page indicator
            if is_active:
                st.markdown(f"""
                <div style="padding: 12px 20px; margin: 8px 16px; 
                           background: linear-gradient(135deg, rgba(79,70,229,0.15), rgba(162,28,175,0.12), rgba(0,242,254,0.08)); 
                           border-radius: 12px; border-left: 4px solid var(--text-accent);
                           box-shadow: 0 4px 16px rgba(79,70,229,0.1);
                           backdrop-filter: blur(10px);">
                    <p style="margin: 0; font-size: 0.8rem; color: var(--text-accent); 
                             text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700;">
                        ✦ Active: {info['desc']}
                    </p>
                </div>
                """, unsafe_allow_html=True)
        
        # Professional footer section
        st.markdown('''
        <div class="sidebar-footer" style="margin-top: 2rem; padding: 2rem 1.5rem; 
                    border-top: 1px solid var(--card-border);
                    background: linear-gradient(0deg, rgba(79,70,229,0.05), rgba(162,28,175,0.03), transparent);
                    text-align: center; position: relative;">
            <div style="font-size: 0.75rem; color: var(--text-secondary); font-weight: 500; margin-bottom: 0.5rem;">
                Powered by ChainCompass AI
            </div>
            <div style="font-size: 0.7rem; color: var(--text-secondary); opacity: 0.7;">
                v2.1.0 | Enterprise Grade
            </div>
        </div>
        ''', unsafe_allow_html=True)
        
        # Close professional sidebar container
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Quick Stats Section - Collapsible
        with st.expander("📊 Quick Stats", expanded=True):
            st.markdown("""
            <div style="background: linear-gradient(135deg, rgba(79,70,229,0.05), rgba(162,28,175,0.05)); border: 1px solid var(--card-border); border-radius: 12px; padding: 0.75rem; margin: 0.25rem 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin: 0.25rem 0;">
                    <span style="color: var(--text-secondary); font-size: 0.875rem; font-weight: 500;">Active Swaps:</span>
                    <span style="color: var(--text-accent); font-weight: 700; font-size: 1rem;">1,247</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin: 0.25rem 0;">
                    <span style="color: var(--text-secondary); font-size: 0.875rem; font-weight: 500;">Total Volume:</span>
                    <span style="color: var(--text-accent); font-weight: 700; font-size: 1rem;">$2.1M</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin: 0.25rem 0;">
                    <span style="color: var(--text-secondary); font-size: 0.875rem; font-weight: 500;">Avg. Fee:</span>
                    <span style="color: var(--text-accent); font-weight: 700; font-size: 1rem;">0.12%</span>
                </div>
            </div>
            """, unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)
        
        # JavaScript for enhanced interactions
        components.html(f"""
            <script>
                // Add hover effects to navigation buttons
                var navButtons = parent.document.querySelectorAll('[data-testid="stSidebar"] button');
                navButtons.forEach(function(button) {{
                    button.addEventListener('mouseenter', function() {{
                        this.style.transform = 'translateX(8px)';
                        this.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.3)';
                    }});
                    button.addEventListener('mouseleave', function() {{
                        this.style.transform = 'translateX(0)';
                        this.style.boxShadow = 'none';
                    }});
                }});
            </script>
        """, height=0)

    # Render the active page with proper structure
    st.markdown('<div class="main-content" style="flex: 1; display: flex; flex-direction: column; padding: 1rem 2rem; background: var(--app-bg); overflow-y: auto;">', unsafe_allow_html=True)
    
    page_functions = {"Dashboard": render_dashboard, "Swap AI": render_swap_ai, "About": render_about_page}
    page_functions[st.session_state.active_page]()
    
    # Close main content container
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Professional footer with proper positioning
    st.markdown(f"""
    <div class="app-footer" style="margin-top: 2rem; padding: 1.5rem 2rem; 
                border-top: 1px solid var(--card-border);
                background: var(--app-bg);">
        <div style="max-width: 1200px; margin: 0 auto;">
            <div style="display: grid; grid-template-columns: 1fr auto; gap: 1.5rem; align-items: center;">
                <div style="display: flex; gap: 1.5rem; align-items: center; flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="font-size: 1.5rem;">🧭</span>
                        <span style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">
                            ChainCompass AI Suite
                        </span>
                        <span style="background: var(--primary-gradient); color: white; 
                                    padding: 0.25rem 0.75rem; border-radius: 12px; 
                                    font-size: 0.75rem; font-weight: 600;">
                            v2.1.0 PRO
                        </span>
                    </div>
                    <div style="display: flex; gap: 1rem; align-items: center; font-size: 0.9rem;">
                        <span style="color: var(--text-secondary);">
                            Mode: <strong style="color: var(--text-accent);">{st.session_state.theme.title()}</strong>
                        </span>
                        <span style="color: var(--text-secondary);">
                            Theme: <span style="display: inline-block; width: 12px; height: 12px; 
                                       background: {st.session_state.accent_color}; border-radius: 50%; 
                                       vertical-align: middle; margin-left: 4px; border: 2px solid var(--card-border);"></span>
                        </span>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem; align-items: center; font-size: 0.85rem; color: var(--text-secondary);">
                    <span>
                        API: <code style="background: var(--surface-weak); padding: 4px 8px; 
                                  border-radius: 6px; font-family: 'JetBrains Mono', monospace;">
                            {API_BASE_URL.split('//')[1] if '//' in API_BASE_URL else API_BASE_URL}
                        </code>
                    </span>
                    <span style="display: flex; align-items: center; gap: 0.5rem;">
                        <span style="color: #22c55e; font-size: 1rem;">●</span>
                        <span style="color: #22c55e; font-weight: 600;">Online</span>
                    </span>
                </div>
            </div>
            <div style="margin-top: 1rem; padding-top: 1rem; 
                        border-top: 1px solid rgba(79,70,229,0.1); text-align: center;">
                <p style="color: var(--text-secondary); font-size: 0.8rem; margin: 0;">
                    © 2025 ChainCompass AI Suite. Professional DeFi Analytics Platform. 
                    Built with ❤️ using Streamlit & Advanced AI Technologies.
                </p>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()

