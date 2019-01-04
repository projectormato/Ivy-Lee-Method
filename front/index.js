Vue.component('todo-item', {
  template: '\
    <li>\
      <label v-bind:class="{ done: isDone }">\
        <input type="checkbox" v-model="isDone">\
        {{ title }}\
      </label>\
      <button v-on:click="$emit(\'remove\')">Remove</button>\
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

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    allTodo: [],
    todos: [],
    todoType: 1
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
      fetch(url, {
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
      });
      this.newTodoText = '';
      //追加したあと、整合性を保つために全件取得をしてきている
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
    todoFillter: function (fillNumber) {
        this.todos = this.allTodo.filter(d => d["todoType"]==fillNumber);
        this.todoType = fillNumber;
    }
  }
});