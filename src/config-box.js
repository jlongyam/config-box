// require createElement.js, Object.forEach
class ConfigBox {
  constructor(title, mouse = false) {
    this.title = title || 'CONFIG'
    this.mouse = mouse
  }
  #el = {}
  #create() {
    let
      el = createElement('div', { classList: 'config-box', draggable: 'true' }),
      el_head = createElement('div', { classList: 'config-box_head' }),
      el_title = createElement('span', { classList: 'config-box_title', textContent: this.title }),
      el_close = createElement('span', { classList: 'config-box_close' }),
      el_body = createElement('div', { classList: 'config-box_body' })
      ;
    document.body.appendChild(el)
    el.appendChild(el_head)
    el_head.appendChild(el_title)
    el_head.appendChild(el_close)
    el.appendChild(el_body)
    // register
    this.#el.root = el
    this.#el.head = el_head
    this.#el.title = el_title
    this.#el.close = el_close
    this.#el.body = el_body
  }
  #listen() {
    if (this.mouse) {
      dragMouse(document.body, this.#el.root, {})
      this.#el.close.addEventListener('click', () => this.#el.root.remove())
    }
    else {
      window.addEventListener('dragover', e => e.preventDefault(), false)
      this.#el.root.addEventListener('drag', e => {
        e.target.style.left = e.clientX + 'px'
        e.target.style.top = e.clientY + 'px'
        e.target.style.visibility = 'hidden'
      })
      this.#el.root.addEventListener('dragend', e => e.target.style.visibility = 'visible')
      this.#el.close.addEventListener('click', () => this.#el.root.remove())
    }
  }
  createText(content = 'LABEL') {
    let
      el_field = createElement('div', { classList: 'config-box_field' }),
      el_text = createElement('span', { classList: 'config-box_text', textContent: content })
      ;
    el_field.appendChild(el_text)
    this.#el.body.appendChild(el_field)
  }
  createAction(text, cb) {
    let
      el_field = createElement('div', { classList: 'config-box_field' }),
      el_action = createElement('span', { classList: 'config-box_action', textContent: text })
      ;
    el_field.appendChild(el_action)
    this.#el.body.appendChild(el_field)
    el_action.addEventListener('click', cb)
  }
  inputValue = ''
  createInput(cb) {
    let
      el_field = createElement('div', { classList: 'config-box_field' }),
      el_input = createElement('span', { classList: 'config-box_input', contentEditable: 'true', spellcheck: 'false' })
      ;
    el_field.appendChild(el_input)
    this.#el.body.appendChild(el_field)
    // https://developer.chrome.com/articles/keyboard-lock/
    if ('keyboard' in navigator && 'lock' in navigator.keyboard) { //console.log('keyboard.lock supported!')
      el_input.addEventListener('keydown', e => {
        if (e.code === 'Enter') e.preventDefault()
        if (cb) cb(e.code, el_input.innerHTML)
        this.inputValue = el_input.innerHTML
      })
    }
  }
  start() {
    this.#create()
    this.#listen()
  }
  setPosition(cfg = { left: '100px', top: '100px', right: 'auto', bottom: 'auto' }, fixed = false) {
    this.#el.root.style.left = cfg.left
    this.#el.root.style.top = cfg.top
    this.#el.root.style.right = cfg.right
    this.#el.root.style.bottom = cfg.bottom
    let width = getComputedStyle(this.#el.root).getPropertyValue('width')
    this.#el.root.style.width = width
    if (fixed) this.#el.root.removeAttribute('draggable')
  }
  get body() {
    return this.#el.body
  }
}
class ConfigChoose {
  constructor(parent) {
    this.parent = parent // should instance of ConfigBox.body
  }
  chooses = []
  #choosen = ''
  #active = false
  create(obj = { 'One': true, 'Two': true, 'Three': false }, cb) {
    let
      el_field = createElement('div', { classList: 'config-box_field' }),
      el_choose = createElement('div', { classList: 'config-box_choose' })
      ;
    el_field.appendChild(el_choose)
    obj.forEach((value, item) => {
      let el_item = createElement('span', { classList: 'config-box_choose-item', textContent: item })
      el_choose.appendChild(el_item)
      if (value) {
        el_item.classList.add('active')
        this.chooses.push(item)
      }
      el_item.addEventListener('click', () => {
        el_item.classList.toggle('active')
        if (!el_item.classList.contains('active')) {
          let i = this.chooses.indexOf(item)
          this.chooses.splice(i, 1)
          this.#active = false
        }
        else {
          if (!this.chooses.includes(item)) this.chooses.push(item)
          this.#active = true
        }
        this.#choosen = item
        if (cb) cb(this.#choosen, this.#active)
      })
    })
    this.parent.appendChild(el_field)
  }
}
class ConfigSwitch {
  constructor(parent) {
    this.parent = parent // should instance of ConfigBox.body
  }
  #choosen = ''
  create(arr = ['One', 'Two', 'Three'], cb) {
    let
      el_field = createElement('div', { classList: 'config-box_field' }),
      el_switch = createElement('div', { classList: 'config-box_switch' })
      ;
    el_field.appendChild(el_switch)
    let el_child = el_switch.children
    function chooseOne(o) {
      el_child.forEach((i) => {
        if (i != o) i.classList.remove('active')
      })
    }
    arr.forEach(item => {
      let el_item = createElement('span', { classList: 'config-box_switch-item', textContent: item })
      el_switch.appendChild(el_item)
      el_item.addEventListener('click', () => {
        if (!el_item.classList.contains('active')) el_item.classList.toggle('active')
        chooseOne(el_item)
        this.#choosen = item
        if (cb) cb(this.#choosen)
      })
    })
    this.parent.appendChild(el_field)
  }
}