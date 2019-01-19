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
    // list表示
  def list() = Action { implicit request: MessagesRequest[AnyContent] =>
    val items: Seq[Todo] = todoService.list()
    // ここのOKはステータスコード200で引数を返しますよってこと404ならNotFound()
    Ok(views.html.list(items))
  }

  // これは 、Seq[services.Todo]をJsonに変換する手段がない(Jsonでサポートされていないものまで含む可能性がある)ので、
  // 暗黙の型変換を行ってよしなにする
  implicit val todoWrites: Writes[services.Todo] = (
    (JsPath \ "id").write[Option[Long]] and
    (JsPath \ "name").write[String] and
    (JsPath \ "todoType").write[Option[Long]]
  )(unlift(services.Todo.unapply))

  // 暗黙の型変換、読み込む方
  implicit val todoReads: Reads[services.Todo] = (
    (JsPath \ "id").readNullable[Long] and
      (JsPath \ "name").read[String] and
      (JsPath \ "todoType").readNullable[Long]
    )(services.Todo.apply _)

  // json形式で一覧を返す
  def todoJsonList = Action { implicit request: MessagesRequest[AnyContent] =>
    val json = Json.toJson(todoService.list())
    Ok(json)
  }

  // POSTからのjsonを受け取ってToDoを追加する
  def todoAddJson() = Action(parse.json) { request =>
    val name: String = request.body("name").as[String]
    val todoType: Option[Long] = request.body("todoType").asOpt[Long]
    val nextId: Option[Long] = todoService.insert(Todo(id = None, name, todoType = todoType))
    Ok(Json.obj("status" -> "OK", "message" -> nextId.get ))
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

}
