Vue.component('todo-item', {
  template: '\
    <li>\
      {{ title }}\
      <button v-on:click="$emit(\'remove\')">Remove</button>\
    </li>\
  ',
  props: ['title']
})



Vue.component('todo-today', {
    props: ['data'],
    template: '<div>Home component</div>'
})
Vue.component('todo-normal', {
    template: '<div>Archive component</div>'
})
Vue.component('todo-batch', {
    template: '<div>Posts component</div>'
})


//propsでそれぞれのコンポーネントにフィルターかけたdataを渡す

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
      var filNumber = 1;
        axios.get('http://localhost:9000/json')
            .then(function(response){
                var data = response.data;
                const result = data.filter(d => d["todoType"]==filNumber);
                // console.log(result)
                this.todos = result;
            }.bind(this))
            .catch(function(error){
                console.log(error)
            })
    },
    computed: {
        currentTabComponent: function () {
            return 'todo-' + this.currentTab.toLowerCase()
        }
    },
  methods: {
    addNewTodo: function () {
      this.todos.push({
        id: this.nextTodoId++,
        name: this.newTodoText
      })
      fetch("http://localhost:9000/json", {
            mode: 'cors',
            method: 'POST',
            headers: {
              "Content-Type" : "application/json"
            },
            body: JSON.stringify({"name":this.newTodoText, "todoType": 1})
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
        var url = "http://localhost:9000/json/" + id + "/delete"
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
    }
  }
})