Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">Remove</button>\
    </li>\
  ',
  props: ['title']
});

// local実行用
var url = "https://ivy-tomato.herokuapp.com/json";
var local = false;
if (local) url = "http://localhost:9000/json";

//dataはサーバ側から取得したToDoの全てが入る。他でも使いたいのでここで定義してるけど、もっと良い方法あるかも
var data = [];
var todoType = 1;

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [],
    nextTodoId: 2,
    currentTab: 'Today',
    tabs: ['Today', 'Normal', 'Batch']
  },
    mounted: function(){
        axios.get(url)
            .then(function(response){
                var filNumber = 1;
                data = response.data;
                const result = data.filter(d => d["todoType"]==filNumber);
                this.todos = result;
                //todoの一覧を見たいときはここでlogする
                // console.log(this.todos);
            }.bind(this))
            .catch(function(error){
                console.log(error)
            })
    },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: data[data.length-1].id+1,
        name: this.newTodoText
      });
      data.push({
        id: data[data.length-1].id+1,
        name: this.newTodoText,
        todoType: todoType
      });
      fetch(url, {
            mode: 'cors',
            method: 'POST',
            headers: {
              "Content-Type" : "application/json"
            },
            body: JSON.stringify({"name":this.newTodoText, "todoType": todoType})
          })
          .then(function(response) {
            return response.json();
          })
          .then(function (json) {
            //statusを見たい時はここでlogする
            // console.log(json);
      });
      this.newTodoText = ''
    },
    deleteTodo: function (id, index) {
        this.todos.splice(index, 1);
        var deleteUrl = url + "/" + id + "/delete";
        fetch(deleteUrl, {
            mode: 'cors',
            method: 'POST',
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({"id":id})
        })
            .then(function(response) {
                return response.json();
            })
            .then(function (json) {
              //statusを見たい時はここでlogする
              // console.log(json);
            });
    },
    todoFillter: function (filNumber) {
        this.todos = data.filter(d => d["todoType"]==filNumber);
        todoType = filNumber;
    }
  }
});