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

// dataはサーバ側から取得したToDoの全てが入る。他でも使いたいのでここで定義してるけど、もっと良い方法あるかも
var data = [];
var todoType = 1;

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: []
  },
    mounted: function(){
        axios.get(url)
            .then(function(response){
                data = response.data;
                this.todos = data.filter(d => d["todoType"]==todoType);
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
            body: JSON.stringify({"name":this.newTodoText, "todoType": todoType})
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
          data = response.data;
          this.todos = data.filter(d => d["todoType"]==todoType);
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
        this.todos = data.filter(d => d["todoType"]==fillNumber);
        todoType = fillNumber;
    }
  }
});