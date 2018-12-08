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
    (JsPath \ "name").write[String]
  )(unlift(services.Todo.unapply))

  // json形式で一覧を返す
  def todoJsonList = Action { implicit request: MessagesRequest[AnyContent] =>
    val json = Json.toJson(todoService.list())
    println(todoService.list())
    Ok(json)
  }

  val todoForm: Form[String] = Form("name" -> nonEmptyText)

  def todoNew = Action { implicit request: MessagesRequest[AnyContent] =>
    Ok(views.html.createForm(todoForm))
  }

  def todoAdd() = Action { implicit request: MessagesRequest[AnyContent] =>
    val name: String = todoForm.bindFromRequest().get
    todoService.insert(Todo(id = None, name))
    Redirect(routes.TodoController.list())
  }

  // 暗黙の型変換、読み込む方
  implicit val todoReads: Reads[services.Todo] = (
    (JsPath \ "id").readNullable[Long] and
    (JsPath \ "name").read[String]
  )(services.Todo.apply _)


  def todoAddJson() = Action(parse.json) { request =>
    val name: String = request.body("name").as[String]
    println(request.body)
    todoService.insert(Todo(id = None, name))
    Ok(Json.obj("status" ->"OK", "message" -> ("Place '"+name+"' saved.") ))
  }

  def todoEdit(todoId: Long) = Action { implicit request: MessagesRequest[AnyContent] =>
    todoService.findById(todoId).map { todo =>
      Ok(views.html.editForm(todoId, todoForm.fill(todo.name)))
    }.getOrElse(NotFound)
  }

  def todoUpdate(todoId: Long) = Action { implicit request: MessagesRequest[AnyContent] =>
    val name: String = todoForm.bindFromRequest().get
    todoService.update(todoId, Todo(Some(todoId), name))
    Redirect(routes.TodoController.list())
  }

  def todoDelete(todoId: Long) = Action { implicit request: MessagesRequest[AnyContent] =>
    todoService.delete(todoId)
    Redirect(routes.TodoController.list())
  }

}
