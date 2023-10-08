class Node {
    // 数据域
    val = undefined;
    // 指针域
    next = null;
    prev = null;
    constructor(val) {
        this.val = val;
    }
}

// 单链表
class LinkedList {
    head = null;
    print() {
        let cur = this.head;
        while(cur) {
            console.log(cur.val);
            cur = cur.next;
        }
    }
    append (params) {
        let node = new Node(params);
        let tail = this.head;
        // 如果链表为空，则将head指向新创建的节点
        if (!tail) {
            this.head = node;
            return;
        }
        // 否则找到链表尾部，tail.next指向新创建的节点
        while (tail.next) {
            tail = tail.next;
        }
        tail.next = node;
    }
    isEmpty () {
        return !this.head;
    }
    size() {
        let length = 0;
        let cur = this.head;
        while(cur) {
            length++;
            cur = cur.next;
        }
        return length;
    }
    // 查找指定节点
    search (params) {
        let result = [];
        let cur = this.head;
        while(cur) {
            if (cur.val === params) {
                result.push(cur);
            }
            cur = cur.next;
        }
        return result;
    }
    // 删除指定节点
    delete (params) {

    }
    insert(params) {

    }
    // 反转链表
    reverse(params) {

    }
}

// 测试
let list = new LinkedList()
console.log(list.isEmpty());
console.log(list.size());

for(let i = 0; i < 5; i+=1) {
    list.append(i);
}
console.log(list.isEmpty());

console.log(list.size());

console.log(list.search(3));

console.log(list.print());