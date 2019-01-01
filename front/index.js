Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">Remove</button>\
    </li>\
  ',
  props: ['title']
})


//propsでそれぞれのコンポーネントにフィルターかけたdataを渡す
//methodsでthis.todos = ~~みたいに書き換えればOK

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
        axios.get('https://ivy-tomato.herokuapp.com/json')
            .then(function(response){
                var filNumber = 1;
                data = response.data;
                const result = data.filter(d => d["todoType"]==filNumber);
                this.todos = result;
                console.log(this.todos);
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
      fetch("https://ivy-tomato.herokuapp.com/json", {
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
            console.log(json);
      });
      this.newTodoText = ''
    },
    deleteTodo: function (id, index) {
        this.todos.splice(index, 1);
        var url = "https://ivy-tomato.herokuapp.com/json/" + id + "/delete"
        fetch(url, {
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
                console.log(json);
            });
    },
    todoFillter: function (filNumber) {
        this.todos = data.filter(d => d["todoType"]==filNumber);
        todoType = filNumber;
    }
  }
})