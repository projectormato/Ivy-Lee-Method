package services

import javax.inject.Inject

import anorm.SqlParser._
import anorm._
import play.api.db.DBApi

import scala.language.postfixOps

case class Todo(id: Option[Long], name: String, todoType: Option[Long])

@javax.inject.Singleton
class TodoService @Inject() (dbapi: DBApi) {

  private val db = dbapi.database("default")

  val simple = {
    get[Option[Long]]("todo.id") ~
    get[String]("todo.name") ~
    get[Option[Long]]("todo.todo_type") map {
      case id~name~todoType => Todo(id, name, todoType)
    }
  }

  def list(): Seq[Todo] = {

    db.withConnection { implicit connection =>

      SQL(
        """
          select * from todo
        """
      ).as(simple *)

    }

  }

  def insert(todo: Todo) = {
    db.withConnection { implicit connection =>
      SQL(
        """
        insert into todo values ({name}, {todo_type})
        """
      ).on(
        'name -> todo.name,
        'todo_type -> todo.todoType
      ).executeUpdate()
    }
  }

  def findById(id: Long): Option[Todo] = {
    db.withConnection { implicit connection =>
      SQL("select * from todo where id = {id}").on('id -> id).as(simple.singleOpt)
    }
  }

  def update(id: Long, todo: Todo) = {
    db.withConnection { implicit connection =>
      SQL(
        """
          update todo
          set name = {name}
          set todo_type = {todo_type}
          where id = {id}
        """
      ).on(
        'id -> id,
        'name -> todo.name,
        'todo_type -> todo.todoType
      ).executeUpdate()
    }
  }

  def delete(id: Long) = {
    db.withConnection { implicit connection =>
      SQL("delete from todo where id = {id}").on('id -> id).executeUpdate()
    }
  }

}
