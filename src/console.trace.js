function func2() { console.trace() }
function func1() { func2() }
func1()

// console.trace 打印堆栈踪迹