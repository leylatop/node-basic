const inquirer = require('inquirer')
// import inquirer from 'inquirer'
const question = [
  {
    type: 'input',
    name: 'name',
    message: '你叫什么名字？'
  }
]

inquirer.prompt(question).then((answers) => {
  console.log(`你好 ${answers['name']}!`)
})