// 被观察者
class Subject {
  constructor(name) {
    this.name = name
    this.observer = []
    this.state = '开心'
  }

  attach(o) {
    this.observer.push(o)
  }

  setState(s) {
    this.state = s
    this.observer.forEach((o) => {
      o.update(this)
    })
  }
}

// 观察者
class Observer {
  constructor(name) {
    this.name = name
  }

  update(s) {
    console.log(`我是${this.name}， 宝宝${s.state}`)
  }
}

const baby = new Subject('宝宝')
const m = new Observer('妈妈')
const f = new Observer('爸爸')
baby.attach(m)
baby.attach(f)
baby.setState('开心')
baby.setState('不开心')