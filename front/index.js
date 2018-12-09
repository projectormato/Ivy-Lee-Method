Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">Remove</button>\
    </li>\
  ',
  props: ['title']
})

new Vue({
  el: '#todo-list-example',
  data: {
    newTodoText: '',
    todos: [],
    nextTodoId: 4
  },
    mounted: function(){
        axios.get('http://localhost:9000/json')
            .then(function(response){
                this.todos = response.data
            }.bind(this))
            .catch(function(error){
                console.log(error)
            })
    },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        title: this.newTodoText
      })
      fetch("http://localhost:9000/json", {
            mode: 'cors',
            method: 'POST',
            headers: {
              "Content-Type" : "application/json"
            },
            body: JSON.stringify({"name":this.newTodoText})
          })
          .then(function(response) {
            return response.json();
          })
          .then(function (json) {
            console.log(json);
      });
      this.newTodoText = ''
    }
  }
})