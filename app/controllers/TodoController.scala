package controllers

import javax.inject._
import play.api.mvc._

import play.api.data._
import play.api.data.Forms._

import services._

// json返すAPIにする時に使う
import play.api.mvc._
import play.api.libs.json._
import play.api.libs.functional.syntax._

class TodoController @Inject()(todoService: TodoService, mcc: MessagesControllerComponents) extends MessagesAbstractController(mcc) {
  def helloworld() = Action{ implicit request: MessagesRequest[AnyContent] =>
    // ここのOKはステータスコード200で引数を返しますよってこと404ならNotFound()
    Ok("Hello World!")
  }

  def list() = Action { implicit request: MessagesRequest[AnyContent] =>
    val items: Seq[Todo] = todoService.list()
    Ok(views.html.list(items))
  }

  // これは 、Seq[services.Todo]をJsonに変換する手段がない(Jsonでサポートされていないものまで含む可能性がある)ので、
  // 暗黙の型変換を行ってよしなにする
  implicit val todoWrites: Writes[services.Todo] = (
    (JsPath \ "id").write[Option[Long]] and
    (JsPath \ "name").write[String] and
    (JsPath \ "todoType").write[Option[Long]]
  )(unlift(services.Todo.unapply))

  // json形式で一覧を返す
  def todoJsonList = Action { implicit request: MessagesRequest[AnyContent] =>
    val json = Json.toJson(todoService.list())
    Ok(json)
  }

  val todoForm: Form[String] = Form("name" -> nonEmptyText)

  def todoNew = Action { implicit request: MessagesRequest[AnyContent] =>
    Ok(views.html.createForm(todoForm))
  }

  def todoAdd() = Action { implicit request: MessagesRequest[AnyContent] =>
    val name: String = todoForm.bindFromRequest().get
    // todoTypeは暫定的な処理。テンプレートエンジンのフォームからの投稿は考慮されていない
    todoService.insert(Todo(id = None, name, todoType = Some(1L)))
    Redirect(routes.TodoController.list())
  }

  // 暗黙の型変換、読み込む方
  implicit val todoReads: Reads[services.Todo] = (
    (JsPath \ "id").readNullable[Long] and
    (JsPath \ "name").read[String] and
    (JsPath \ "todoType").readNullable[Long]
  )(services.Todo.apply _)

  // POSTからのjsonを受け取ってToDoを追加する
  def todoAddJson() = Action(parse.json) { request =>
    val name: String = request.body("name").as[String]
    val todoType: Option[Long] = request.body("todoType").asOpt[Long]
    todoService.insert(Todo(id = Some(1L), name, todoType = todoType))
    Ok(Json.obj("status" ->"OK", "message" -> ("ToDo '"+name+"' added.") ))
  }

  def todoEdit(todoId: Long) = Action { implicit request: MessagesRequest[AnyContent] =>
    todoService.findById(todoId).map { todo =>
      Ok(views.html.editForm(todoId, todoForm.fill(todo.name)))
    }.getOrElse(NotFound)
  }

  def todoUpdate(todoId: Long) = Action { implicit request: MessagesRequest[AnyContent] =>
    val name: String = todoForm.bindFromRequest().get
    // todoType。テンプレートエンジンのフォームからの投稿は考慮されていない
    todoService.update(todoId, Todo(Some(todoId), name, Some(1L)))
    Redirect(routes.TodoController.list())
  }

  // POSTからのjsonを受け取って編集する
  def todoUpdateJson(todoId: Long) = Action(parse.json) { request =>
    val name: String = request.body("name").as[String]
    val todoType: Option[Long] = request.body("todoType").asOpt[Long]
    todoService.update(todoId, Todo(Some(todoId), name, todoType))
    Ok(Json.obj("status" ->"OK", "message" -> ("ToDo '"+name+"' changed.") ))
  }

  // POSTからのjsonを受け取って削除する
  def todoDeleteJson(todoId: Long) = Action(parse.json) { request =>
    todoService.delete(todoId)
    Ok(Json.obj("status" ->"OK", "message" -> ("ToDoId '"+todoId+"' deleted.") ))
  }

  def todoDelete(todoId: Long) = Action { implicit request: MessagesRequest[AnyContent] =>
    todoService.delete(todoId)
    Redirect(routes.TodoController.list())
  }

}
