$(document).ready(function() {
	getTasks();
	getCategories();
	getCategoryOptions();
	/**
	 * Events for Edit and Delete Button -- Tasks
	 */
	//Handle Events - When Add Task
	$("#add_task").on("submit", addTask);
	//Handle Events - When Edit Task
	$("#edit_task").on("submit", editTask);

	//Transfer the Id from Add Task to Edit Task Using Sessions
	$("body").on("click", ".btn-edit-task", setTask);

	//Transfer the Id from Add Task to Delete Task Using Sessions
	$("body").on("click", ".btn-delete-task", deleteTask);

	/**
	 * Events for Edit and Delete Button -- Categories
	 */
	//Handle Events - When Add Category
	$("#add_category").on("submit", addCategory);

	//Handle Events - When Edit Category
	$("#edit_category").on("submit", editCategory);

	//Transfer the Id from Add Task to Edit Task Using Sessions
	$("body").on("click", ".btn-edit-category", setCategory);

	//Transfer the Id from Add Task to Delete Task Using Sessions
	$("body").on("click", ".btn-delete-category", deleteCategory);
});
const apikey = "jI7WpUezDGNJa4D_vG8Pf85i4Vyxz8no";
/**
 * List the tasks in the Hompage
 */
function getTasks() {
	$.get(
		`https://api.mlab.com/api/1/databases/taskmanager/collections/tasks?apiKey=${apikey}`,
		function(data) {
			let output = '<ul class="list-group">';
			$.each(data, function(key, task) {
				output += '<li class="list-group-item">';
				output +=
					task.task_name +
					`<span class="due_on">[Due on ${task.due_date}]</span>`;

				if (task.is_urgent == "true") {
					output += '<span class="label label-danger">Urgent</span>';
				}

				output += ` <div class = "float-right">
                        <a class="btn btn-sm btn-primary btn-edit-task" data-task-name="${
													task.task_name
												}" data-task-id="${task._id.$oid}">Edit</a>
                        <a class="btn btn-sm btn-danger btn-delete-task" data-task-id="${
													task._id.$oid
												}" >Delete</a>
                    </div>`;
			});
			output += "</ul>";
			//console.log(output);
			$("#tasks").html(output);
		}
	);
}
/**
 * Function Ends Here
 */

function getCategories() {
	$.get(
		`https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey=${apikey}`,
		function(data) {
			let output = '<ul class="list-group">';
			$.each(data, function(key, category) {
				output += '<li class="list-group-item">';
				output += category.category_name;
				output += ` <div class = "float-right">
                          <a class="btn btn-sm btn-primary btn-edit-category" data-category-name="${
														category.category_name
													}" data-category-id="${category._id.$oid}">Edit</a>
                          <a class="btn btn-sm btn-danger btn-delete-category" data-category-id="${
														category._id.$oid
													}" >Delete</a>
                      </div>`;
			});
			output += "</ul>";
			//console.log(output);
			$("#categories").html(output);
		}
	);
}

/**
 * This function Adds a task to the homepage
 */
function addTask(e) {
	var taskName = $("#task_name").val();
	var category = $("#category").val();
	var dueDate = $("#due_date").val();
	var isUrgent = $("#is_urgent").val();

	//POST Request
	$.ajax({
		url: `https://api.mlab.com/api/1/databases/taskmanager/collections/tasks?apiKey=${apikey}`,
		data: JSON.stringify({
			task_name: taskName,
			category: category,
			due_date: dueDate,
			is_urgent: isUrgent
		}),
		type: "POST",
		contentType: "application/json",
		success: function(data) {
			window.location.href = "index.html";
		},
		error: function(xhr, status, err) {
			console.log("ERROR", err);
		}
	});

	e.preventDefault();
}
/**
 * Function Ends Here
 */

/**
 * This functions sets the task using Edit button
 */

function setTask() {
	var task_id = $(this).data("task-id");
	sessionStorage.setItem("current_id", task_id);
	window.location.href = "editTask.html";
	return false;
}

/**
 * Function Ends Here
 */

/**
 * Get the category options in the Add Task Page
 */
function getCategoryOptions() {
	$.get(
		`https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey=${apikey}`,
		function(data) {
			var output = "";
			$.each(data, function(key, category) {
				output += `<option value=${category.category_name}>${
					category.category_name
				}</option>`;
			});
			$("#category").append(output);
		}
	);
}
/**
 * Function Ends Here
 */

/**
 * Get Tasks From Edit Task HTML
 * And then Edit it
 * And Submit it
 */
function getTask(id) {
	$.get(
		`https://api.mlab.com/api/1/databases/taskmanager/collections/tasks/${id}?apiKey=${apikey}`,
		function(task) {
			$("#task_name").val(task.task_name);
			$("#category").val(task.category);
			$("#due_date").val(task.due_date);
			$("#is_urgent").val(task.is_urgent);
		}
	);
}
/**
 * Function Ends Here
 */

/**
 * Edit Tasks Function
 */
function editTask(e) {
	var task_id = sessionStorage.getItem("current_id");
	var taskName = $("#task_name").val();
	var category = $("#category").val();
	var dueDate = $("#due_date").val();
	var isUrgent = $("#is_urgent").val();

	//POST Request
	$.ajax({
		url: `https://api.mlab.com/api/1/databases/taskmanager/collections/tasks/${task_id}?apiKey=${apikey}`,
		data: JSON.stringify({
			task_name: taskName,
			category: category,
			due_date: dueDate,
			is_urgent: isUrgent
		}),
		type: "PUT",
		contentType: "application/json",
		success: function(data) {
			window.location.href = "index.html";
		},
		error: function(xhr, status, err) {
			console.log("ERROR", err);
		}
	});

	e.preventDefault();
}
/**
 * Function Ends Here
 */

/**
 * Delete Tasks Function
 */
function deleteTask() {
	var task_id = $(this).data("task-id");
	$.ajax({
		url: `https://api.mlab.com/api/1/databases/taskmanager/collections/tasks/${task_id}?apiKey=${apikey}`,
		type: "DELETE",
		async: true,
		contentType: "application/json",
		success: function(data) {
			window.location.href = "index.html";
		},
		error: function(xhr, status, err) {
			console.log("ERROR", err);
		}
	});
}
/**
 * Function Ends Here
 */

/**
 * Add Categories Function
 */
function addCategory(e) {
	var categoryName = $("#category_name").val();

	//POST Request
	$.ajax({
		url: `https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey=${apikey}`,
		data: JSON.stringify({
			category_name: categoryName
		}),
		type: "POST",
		contentType: "application/json",
		success: function(data) {
			window.location.href = "categories.html";
		},
		error: function(xhr, status, err) {
			console.log("ERROR", err);
		}
	});

	e.preventDefault();
}
/**
 * Function Ends Here
 */

/**
 * Set Category Function
 */
function setCategory() {
	var category_id = $(this).data("category-id");
	sessionStorage.setItem("current_id", category_id);
	window.location.href = "editCategory.html";
	return false;
}

/**
 * Function Ends Here
 */

/**
 * Get Category From Edit Category HTML
 * And then Edit it
 * And Submit it
 */
function getCategory(id) {
	$.get(
		`https://api.mlab.com/api/1/databases/taskmanager/collections/categories/${id}?apiKey=${apikey}`,
		function(category) {
			$("#category_name").val(category.category_name);
		}
	);
}
/**
 * Function Ends Here
 */

/**
 * Edit Category Function
 */
function editCategory(e) {
	var category_id = sessionStorage.getItem("current_id");
	var categoryName = $("#category_name").val();
	//POST Request
	$.ajax({
		url: `https://api.mlab.com/api/1/databases/taskmanager/collections/categories/${category_id}?apiKey=${apikey}`,
		data: JSON.stringify({
			category_name: categoryName
		}),
		type: "PUT",
		contentType: "application/json",
		success: function(data) {
			window.location.href = "categories.html";
		},
		error: function(xhr, status, err) {
			console.log("ERROR", err);
		}
	});

	e.preventDefault();
}
/**
 * Function Ends Here
 */

/**
 * Delete Category Function
 */
function deleteCategory() {
	var category_id = $(this).data("category-id");
	$.ajax({
		url: `https://api.mlab.com/api/1/databases/taskmanager/collections/categories/${category_id}?apiKey=${apikey}`,
		type: "DELETE",
		async: true,
		contentType: "application/json",
		success: function(data) {
			window.location.href = "categories.html";
		},
		error: function(xhr, status, err) {
			console.log("ERROR", err);
		}
	});
}
/**
 * Function Ends Here
 */
