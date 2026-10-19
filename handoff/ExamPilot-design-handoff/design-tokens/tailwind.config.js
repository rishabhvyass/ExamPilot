/** ExamPilot — Tailwind v3 config (Lavender Calm). Merge `theme.extend` into your project config. */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ground: '#EDECE8',
        surface: { DEFAULT: '#FFFFFF', muted: '#F4F2EE', input: '#F7F6F3' },
        splash: '#C9C0DB',
        track: '#ECEAE5',
        line: { DEFAULT: '#E4E1DA', strong: '#CFCAC1' },
        ink: { DEFAULT: '#1B1B1F', muted: '#5C5866', subtle: '#77727F' },
        se:  { fill: '#D6CDE6', deep: '#C5BADB', text: '#3E3557', mark: '#7D6BAA', art: '#8C7BB5' },
        daa: { fill: '#EBD3D7', deep: '#DDB5BD', text: '#6B3440', mark: '#B86A7A', art: '#C98A96' },
        dds: { fill: '#CFE6E0', deep: '#A9D3C8', text: '#24524A', mark: '#4F9686', art: '#6FAFA2' },
        art: { plum: '#8C7BB5', pink: '#E9C4CC', mint: '#BFE0D8' },
        info: { fill: '#E3EEF8', text: '#2C5577' },
        headsup: { fill: '#FEF3DC', text: '#7A5300' },
        error: { fill: '#FDE7E4', text: '#9A3B33' },
      },
      fontFamily: { sans: ['Urbanist', 'system-ui', 'sans-serif'] },
      fontSize: {
        'splash': ['60px', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '600' }],
        'display': ['46px', { lineHeight: '1.02', letterSpacing: '-0.03em', fontWeight: '600' }],
        'onboard': ['40px', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '600' }],
        'stat': ['54px', { lineHeight: '1', letterSpacing: '-0.03em', fontWeight: '600' }],
        'card-title': ['28px', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'section': ['24px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
      },
      borderRadius: { input: '22px', panel: '28px', card: '34px', sheet: '36px' },
      boxShadow: {
        card: '0 1px 2px rgba(60,45,20,.04), 0 6px 20px rgba(60,45,20,.05)',
        nav: '0 12px 32px rgba(40,30,60,.14)',
        sheet: '0 2px 4px rgba(60,45,20,.05), 0 16px 40px rgba(60,45,20,.10)',
        fab: '0 10px 26px rgba(27,27,31,.25)',
      },
      spacing: { gutter: '20px', 'icon-btn': '56px', 'safe-bottom': '128px' },
      transitionTimingFunction: {
        standard: 'cubic-bezier(.2,0,0,1)',
        decelerate: 'cubic-bezier(.05,.7,.1,1)',
        smooth: 'cubic-bezier(.2,.8,.2,1)',
        overshoot: 'cubic-bezier(.2,.9,.25,1.05)',
      },
    },
  },
  plugins: [],
};
