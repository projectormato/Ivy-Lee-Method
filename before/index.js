Vue.component('todo-item', {
  template: '\
    <li>\
      <label v-bind:class="{ done: isDone }">\
        <input type="checkbox" v-model="isDone">\
        {{ title }}\
      </label>\
      <button v-on:click="$emit(\'remove\')" class="remove-btn">Remove</button>\
    </li>\
  ',
  props: ['title', 'id', 'isChecked'],
  data: function () {
      return {
          isDone: this.isChecked
      }
    }
});

// local実行用
var url = "https://ivy-tomato.herokuapp.com/json";
var local = false;
if (local) url = "http://localhost:9000/json";

const vm = new Vue({
  el: '#todo-ivy',
  data: {
    newTodoText: '',
    allTodo: [],
    todos: [],
    todoType: 1,
    nextTodoId: 1
  },
    mounted: function(){
        axios.get(url)
            .then(function(response){
                this.allTodo = response.data;
                this.todos = this.allTodo.filter(d => d["todoType"]==this.todoType);
                //todoの一覧を見たいときはここでlogする
                // console.log(this.todos);
            }.bind(this))
            .catch(function(error){
                console.log(error);
            })
    },
  methods: {
    addNewTodo: function () {
      this.allTodo.push({
          id: this.nextTodoId,
          name: this.newTodoText,
          todoType: this.todoType
      });
      this.todos.push({
          id: this.nextTodoId,
          name: this.newTodoText,
          todoType: this.todoType
      });
      var a = fetch(url, {
            mode: 'cors',
            method: 'POST',
            headers: {
              "Content-Type" : "application/json"
            },
            body: JSON.stringify({"name":this.newTodoText, "todoType": this.todoType})
          })
          .then(function(response) {
            return response.json();
          })
          .then(function (json) {
            // statusを見たい時はここでlogする
            // console.log(json);
            vm.todos[vm.todos.length-1].id = parseInt(json["message"])
      });
      this.newTodoText = '';
    },
    deleteTodo: function (id, index) {
        this.todos.splice(index, 1);
        this.allTodo = this.allTodo.filter(d => d["id"] !== id);
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
    todoFillter: function (fillNumber) {
        this.todos = this.allTodo.filter(d => d["todoType"]==fillNumber);
        this.todoType = fillNumber;
    }
  }
});

// for PWA
if('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        .then(function() { console.log("Service Worker Registered"); });
}