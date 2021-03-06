class viewHelper {
  // Retrieve an element from the DOM
  static getElement(selector) {
    const element = document.querySelector(selector);

    return element;
  }

  // Create an element with an optional CSS class
  static createElement(tag, classNames) {
    const element = document.createElement(tag);

    for (var className of classNames) {
      element.classList.add(className);
    }
    return element;
  }
}

class StudentModel {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.filterParameters = {};
    this.sortParameters = {};
    this.pageParameters = { page: 1, pagesize: 4 };
    this.getStudentData();
  }

  getPage(page) {
    this.pageParameters.page = page;
    this.getStudentData();
  }

  getStudentData() {
    console.log("In GetStudent()");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        this.studentResponse = JSON.parse(this.responseText);
        const element = document.querySelector("#root");
        let event = new CustomEvent("GetStudentData", {
          detail: this.studentResponse,
        });
        element.dispatchEvent(event);
      }
    };

    let pagequery = `page=${this.pageParameters.page}&pagesize=${this.pageParameters.pagesize}`;
    let filterquery = "";
    if (this.filterParameters) {
      if (this.filterParameters.class) {
        filterquery = filterquery + `class=${this.filterParameters.class}`;
      }
      if (this.filterParameters.major) {
        filterquery =
          (filterquery ? filterquery + "&" : "") +
          `major=${this.filterParameters.major}`;
      }
      if (this.filterParameters.namesearch) {
        filterquery =
          (filterquery ? filterquery + "&" : "") +
          `namesearch=${this.filterParameters.namesearch}`;
      }
      if (this.filterParameters.gpamin) {
        filterquery =
          (filterquery ? filterquery + "&" : "") +
          `gpamin=${this.filterParameters.gpamin}`;
      }
      if (this.filterParameters.gpamax) {
        filterquery =
          (filterquery ? filterquery + "&" : "") +
          `gpamax=${this.filterParameters.gpamax}`;
      }
    }

    let sortquery = "";
    if (this.sortParameters) {
      if (this.sortParameters.sortby) {
        if (this.sortParameters.sortorder) {
          sortquery = `sortby=${this.sortParameters.sortby}&sortorder=${this.sortParameters.sortorder}`;
        } else {
          sortquery = `sortby=${this.sortParameters.sortby}`;
        }
      }
    }

    let query =
      pagequery +
      (filterquery ? "&" + filterquery : "") +
      (sortquery ? "&" + sortquery : "");

    let url = `http://localhost:3050/api/students?${query}`;

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  }

  deleteStudent(id) {
    console.log("In DeleteStudent()");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        const element = document.querySelector("#root");
        let data = { response: this.responseText, studentid: id };
        let event = new CustomEvent("StudentDeleted", { detail: data });
        element.dispatchEvent(event);
      }
      if (this.readyState == 4 && this.status == 400) {
        console.log(this.responseText);
        const element = document.querySelector("#root");
        let data = JSON.parse(this.responseText);
        console.log(data);

        let message = "";
        if (data.errorMessages) message = data.errorMessages.join(", ");
        else message = "An error ocurred";
        let event = new CustomEvent("Error", { detail: message });
        element.dispatchEvent(event);
      }
    };

    let url = `http://localhost:3050/api/students/${id}`;

    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  }

  addStudent(id, nameValue, classValue, majorValue) {
    console.log("In addStudent()");
    console.log(id);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && (this.status == 200 || this.status == 201)) {
        console.log(this.responseText);
        const element = document.querySelector("#root");
        let data = { response: JSON.parse(this.responseText) };
        let event;

        if (id) event = new CustomEvent("StudentEdited", { detail: data });
        else event = new CustomEvent("StudentAdded", { detail: data });
        element.dispatchEvent(event);
      }
      if (this.readyState == 4 && this.status == 400) {
        console.log(this.responseText);
        const element = document.querySelector("#root");
        let data = JSON.parse(this.responseText);
        console.log(data);

        let message = "";
        if (data.errorMessages) message = data.errorMessages.join(",&nbsp;");
        else message = "An error ocurred";
        let event = new CustomEvent("Error", { detail: message });
        element.dispatchEvent(event);
      }
    };

    let url;

    if (id) url = `http://localhost:3050/api/students/${id}`;
    else url = `http://localhost:3050/api/students/`;

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(
      JSON.stringify({ name: nameValue, class: classValue, major: majorValue })
    );
  }

  editStudent(nameValue, classValue, majorValue) {
    console.log("In addStudent()");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        const element = document.querySelector("#root");
        let data = { response: this.responseText };
        let event = new CustomEvent("StudentAdded", { detail: data });
        element.dispatchEvent(event);
      }
      if (this.readyState == 4 && this.status == 400) {
        console.log(this.responseText);
        const element = document.querySelector("#root");
        let data = JSON.parse(this.responseText);
        console.log(data);

        let message = "";
        if (data.errorMessages) message = data.errorMessages.join(",&nbsp;");
        else message = "An error ocurred";
        let event = new CustomEvent("Error", { detail: message });
        element.dispatchEvent(event);
      }
    };

    let url = `http://localhost:3050/api/students/`;

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(
      JSON.stringify({ name: nameValue, class: classValue, major: majorValue })
    );
  }
}

class StudentView {
  constructor() {}

  createView(studentResponse) {
    this.studentData = studentResponse.data;
    this.pageParameters = studentResponse.pageparameters;
    this.sortParameters = studentResponse.sortparameters;
    this.filterParameters = studentResponse.filterparameters;

    this.app = viewHelper.getElement("#root");
    this.app.replaceChildren();

    let title = this.createTitle();
    let cards = this.createCards();
    let footer = this.createFooter();

    let container = viewHelper.createElement("div", ["container"]);
    container.append(title, cards, footer);

    this.app.append(container);
  }

  createTitle() {
    let filterPillTemplate = this.createFilterPillTemplate();
    let sortPillTemplate = this.createSortPillTemplate();

    let searchValue = "";
    if (this.filterParameters.namesearch)
      searchValue = this.filterParameters.namesearch;

    let titleTemplate =
      '<div class = "title ht-4 mb-2 d-flex"> ' +
      "<h3>Students</h3>" +
      '<div class="ml-auto form-inline">' +
      '<div class="input-group">' +
      `<input id="nameSearch" class="form-control" type="text" placeholder="Search" value="${searchValue}"></input>` +
      '<div class="input-group-append">' +
      '<button class="btn btn-outline-secondary" type="button" onClick="app.handleSearchClick()"><img  src="/icons/search.svg" alt="Search" text-size="1em"></button>' +
      "</div>" +
      "</div>" +
      '<button class="btn btn-outline-secondary ml-2" type="button" onClick="app.handleFilterClick()"><img class="p-1" src="/icons/funnel.svg" alt="Filter" text-size="1em"></button>' +
      '<button class="btn btn-outline-secondary ml-2" type="button" onClick="app.handleAddCardClick()"><img class="p-1" src="/icons/plus.svg" alt="Add" text-size="1em"></button>' +
      "</div>" +
      "</div>" +
      '<div class = "title d-flex" m-2> ' +
      `<div>${filterPillTemplate}</div>` +
      `<div>${sortPillTemplate}</div>` +
      "</div>";
    let title = document.createElement("div");
    title.innerHTML = titleTemplate;
    return title;
  }

  createFilterPillTemplate() {
    let filterPillTemplateLabel = "filters:";
    let filterpillTemplateValue = "";
    if (this.filterParameters.class)
      filterpillTemplateValue += `<span class="badge badge-pill badge-secondary ml-2">class = ${this.filterParameters.class}</span>`;
    if (this.filterParameters.major)
      filterpillTemplateValue += `<span class="badge badge-pill badge-secondary ml-2">major = ${this.filterParameters.major}</span>`;
    if (this.filterParameters.gpamin)
      filterpillTemplateValue += `<span class="badge badge-pill badge-secondary ml-2">gpa >= ${this.filterParameters.gpamin}</span>`;
    if (this.filterParameters.gpamax)
      filterpillTemplateValue += `<span class="badge badge-pill badge-secondary ml-2">gpa <= ${this.filterParameters.gpamax}</span>`;

    if (!filterpillTemplateValue) filterpillTemplateValue = "&nbsp;none";

    return filterPillTemplateLabel + filterpillTemplateValue;
  }

  createSortPillTemplate() {
    let sortPillTemplateLabel = '<span class="ml-4">sort:</span>';
    let sortPillTemplateValue = "";

    if (!this.sortParameters) return "";

    if (this.sortParameters.sortorder)
      sortPillTemplateValue += `<span class="badge badge-pill badge-secondary ml-2">${this.sortParameters.sortby} ${this.sortParameters.sortorder}</span>`;
    else
      sortPillTemplateValue += `<span class="badge badge-pill badge-secondary ml-2">${this.sortParameters.sortby}</span>`;

    return sortPillTemplateLabel + sortPillTemplateValue;
  }

  createFooter() {
    let footer = document.createElement("div");
    footer.innerHTML = this.createFancyPager();
    return footer;
  }

  createSimplePager() {
    let prevButtonDisabled = "";
    let nextButtonDisabled = '"';
    if (Number(this.pageParameters.currentpage) == 1) {
      prevButtonDisabled = 'disabled = "true"';
    }
    if (
      Number(this.pageParameters.currentpage) >=
      Number(this.pageParameters.totalpages)
    ) {
      nextButtonDisabled = 'disabled = "true"';
    }

    let pagerTemplate =
      '<div class = "ht-4 mt-4 d-flex"> ' +
      `<div> <button class="btn btn-outline-secondary" type="button" onClick="app.handleChangePage(${
        Number(this.pageParameters.currentpage) - 1
      })" ${prevButtonDisabled}>previous page</button> </div>` +
      `<div class="ml-auto"> <button class="btn btn-outline-secondary" type="button" onClick="app.handleChangePage(${
        Number(this.pageParameters.currentpage) + 1
      })" ${nextButtonDisabled}>next page</button> </div>` +
      "</div>";
    return pagerTemplate;
  }

  createFancyPager() {
    let prevButtonDisabled = "";
    let nextButtonDisabled = '"';
    if (Number(this.pageParameters.currentpage) == 1) {
      prevButtonDisabled = 'disabled = "true"';
    }
    if (
      Number(this.pageParameters.currentpage) >=
      Number(this.pageParameters.totalpages)
    ) {
      nextButtonDisabled = 'disabled = "true"';
    }

    let pageButtons = "";
    for (let i = 1; i <= this.pageParameters.totalpages; i++) {
      if (i == this.pageParameters.currentpage)
        pageButtons += `<div class="btn btn-outline-dark ml-auto mr-auto" onClick="app.handleChangePage(${i})">${i}</div>`;
      else
        pageButtons += `<div class="btn btn-light ml-auto mr-auto" onClick="app.handleChangePage(${i})">${i}</div>`;
    }

    let pagerTemplate =
      '<div class = "ht-4 mt-4 d-flex"> ' +
      `<div> <button class="btn btn-outline-secondary" type="button" onClick="app.handleChangePage(${
        Number(this.pageParameters.currentpage) - 1
      })" ${prevButtonDisabled}>previous page</button> </div>` +
      pageButtons +
      `<div class="ml-auto"> <button class="btn btn-outline-secondary" type="button" onClick="app.handleChangePage(${
        Number(this.pageParameters.currentpage) + 1
      })" ${nextButtonDisabled}>next page</button> </div>` +
      "</div>";
    return pagerTemplate;
  }

  createCards() {
    let cardDeck = viewHelper.createElement("div", ["card-deck"]);

    //Create Student Cards
    for (var student of this.studentData) {
      let card = viewHelper.createElement("div", ["card"]);
      card.setAttribute("onClick", "app.handleCardClick(" + student.id + ");");

      let cardBody = viewHelper.createElement("div", ["card-body"]);
      let cardTitle = viewHelper.createElement("div", ["card-title"]);
      cardTitle.textContent = student.name;
      let cardText = viewHelper.createElement("p", ["card-text"]);
      cardText.textContent = student.class;

      cardBody.append(cardTitle, cardText);
      card.append(cardBody);
      cardDeck.append(card);
    }

    if (this.studentData.length == 0)
      cardDeck.innerHTML =
        "<div class='ml-auto mr-auto'>no results match the specified filters</div>";

    return cardDeck;
  }

  createStudentModal(id) {
    let student = this.studentData.find((x) => x.id === id);
    let modalTitle = viewHelper.getElement("#studentModalLabel");
    modalTitle.textContent = student.name;

    let modalButtons = viewHelper.getElement("#studentModalbuttons");
    let modalButtonsTemplate =
      `<button type="button" class="btn btn-outline-secondary" onClick="app.handleDeleteCard(${id});">Delete</button>` +
      `<button type="button" class="btn btn-outline-secondary ml-2" onClick="app.handleOpenEditCard(${id});">Edit</button>`;
    modalButtons.innerHTML = modalButtonsTemplate;

    let classRow = this.createDataRow("Class", student.class);
    let majorRow = this.createDataRow("Major", student.major);
    let gpaRow = this.createDataRow("GPA", student.gpa);

    let modalBody = viewHelper.getElement("#studentModalBody");
    modalBody.replaceChildren();
    modalBody.append(classRow, majorRow, gpaRow);

    let btnFooterClose = viewHelper.createElement("button", [
      "btn",
      "btn-primary",
    ]);
    btnFooterClose.setAttribute("type", "button");
    btnFooterClose.setAttribute("data-dismiss", "modal");
    btnFooterClose.textContent = "Close";
    let modalFooter = viewHelper.getElement("#studentModalFooter");
    modalFooter.replaceChildren();
    modalFooter.append(btnFooterClose);

    $("#studentModal").modal("toggle");
  }

  createAddStudentModal() {
    let modalTitle = viewHelper.getElement("#studentModalLabel");
    modalTitle.textContent = "Add Student";

    let modalButtons = viewHelper.getElement("#studentModalbuttons");
    modalButtons.replaceChildren();

    let nameRow = this.createInputRow("Name", "name", "");
    let classRow = this.createInputRow("Class", "class", "");
    let majorRow = this.createInputRow("Major", "major", "");

    let modalBody = viewHelper.getElement("#studentModalBody");
    modalBody.replaceChildren();
    modalBody.append(nameRow, classRow, majorRow);

    let btnFooterSave = viewHelper.createElement("button", [
      "btn",
      "btn-primary",
    ]);
    btnFooterSave.setAttribute("type", "button");
    btnFooterSave.setAttribute("onclick", "app.handleSaveStudentClick()");
    btnFooterSave.textContent = "Save";
    let btnFooterCancel = viewHelper.createElement("button", [
      "btn",
      "btn-outline-secondary",
    ]);
    btnFooterCancel.setAttribute("type", "button");
    btnFooterCancel.setAttribute("data-dismiss", "modal");
    btnFooterCancel.textContent = "Cancel";
    let modalFooter = viewHelper.getElement("#studentModalFooter");
    modalFooter.replaceChildren();
    modalFooter.append(btnFooterCancel, btnFooterSave);

    $("#studentModal").modal("toggle");
  }

  createEditStudentModal(id) {
    let student = this.studentData.find((x) => x.id === id);
    let modalTitle = viewHelper.getElement("#studentModalLabel");
    modalTitle.textContent = "Edit Student";

    let modalButtons = viewHelper.getElement("#studentModalbuttons");
    modalButtons.replaceChildren();

    let nameRow = this.createInputRow("Name", "name", student.name);
    let classRow = this.createInputRow("Class", "class", student.class);
    let majorRow = this.createInputRow("Major", "major", student.major);

    let modalBody = viewHelper.getElement("#studentModalBody");
    modalBody.replaceChildren();
    modalBody.append(nameRow, classRow, majorRow);

    let btnFooterSave = viewHelper.createElement("button", [
      "btn",
      "btn-primary",
    ]);
    btnFooterSave.setAttribute("type", "button");
    btnFooterSave.setAttribute(
      "onclick",
      "app.handleSaveStudentClick(" + id + ")"
    );
    btnFooterSave.textContent = "Save";
    let btnFooterCancel = viewHelper.createElement("button", [
      "btn",
      "btn-outline-secondary",
    ]);
    btnFooterCancel.setAttribute("type", "button");
    btnFooterCancel.setAttribute("data-dismiss", "modal");
    btnFooterCancel.textContent = "Cancel";
    let modalFooter = viewHelper.getElement("#studentModalFooter");
    modalFooter.replaceChildren();
    modalFooter.append(btnFooterCancel, btnFooterSave);
  }

  createFilterModal() {
    let modalTitle = viewHelper.getElement("#studentModalLabel");
    modalTitle.textContent = "Filters";

    let modalButtons = viewHelper.getElement("#studentModalbuttons");
    modalButtons.replaceChildren();

    let classValue = this.filterParameters.class
      ? this.filterParameters.class
      : "";
    let majorValue = this.filterParameters.major
      ? this.filterParameters.major
      : "";
    let gpaMinValue = this.filterParameters.gpamin
      ? this.filterParameters.gpamin
      : "";
    let gpaMaxValue = this.filterParameters.gpamax
      ? this.filterParameters.gpamax
      : "";
    let sortByValue = this.sortParameters.sortby
      ? this.sortParameters.sortby
      : "";
    let sortOrderValue = this.sortParameters.sortorder
      ? this.sortParameters.sortorder
      : "";

    let classOptions = [
      { name: "", value: "" },
      { name: "Senior", value: "senior" },
      { name: "Junior", value: "junior" },
      { name: "Sophmore", value: "sophmore" },
      { name: "Freshman", value: "freshman" },
    ];
    let majorOptions = [
      { name: "", value: "" },
      { name: "Art", value: "art" },
      { name: "Biology", value: "biology" },
      { name: "Computer Science", value: "computer science" },
      { name: "Engineering", value: "engineering" },
    ];
    let sortByOptions = [
      { name: "", value: "" },
      { name: "Id", value: "id" },
      { name: "Name", value: "name" },
      { name: "Class", value: "class" },
      { name: "Major", value: "major" },
    ];
    let sortOrderOptions = [
      { name: "", value: "" },
      { name: "Ascending", value: "asc" },
      { name: "Descending", value: "desc" },
    ];
    let gpaOptions = [
      { name: "", value: "" },
      { name: "2.0", value: "2.0" },
      { name: "2.5", value: "2.5" },
      { name: "3.0", value: "3.0" },
      { name: "3.5", value: "3.5" },
      { name: "4.0", value: "4.0" },
    ];

    let classRow = this.createSelectRow(
      "Class",
      "filterClass",
      classValue,
      classOptions
    );
    let majorRow = this.createSelectRow(
      "Major",
      "filterMajor",
      majorValue,
      majorOptions
    );
    let gpaMinRow = this.createSelectRow(
      "Min GPA",
      "filterGpaMin",
      gpaMinValue,
      gpaOptions
    );
    let gpaMaxRow = this.createSelectRow(
      "Max GPA",
      "filterGpaMax",
      gpaMaxValue,
      gpaOptions
    );
    let sortByRow = this.createSelectRow(
      "Sort By",
      "sortBy",
      sortByValue,
      sortByOptions
    );
    let sortOrderRow = this.createSelectRow(
      "Sort Order",
      "sortOrder",
      sortOrderValue,
      sortOrderOptions
    );

    let modalBody = viewHelper.getElement("#studentModalBody");
    modalBody.replaceChildren();
    modalBody.append(
      classRow,
      majorRow,
      gpaMinRow,
      gpaMaxRow,
      sortByRow,
      sortOrderRow
    );

    let btnFooterApply = viewHelper.createElement("button", [
      "btn",
      "btn-primary",
    ]);
    btnFooterApply.setAttribute("type", "button");
    btnFooterApply.setAttribute("onclick", "app.handleApplyFilters()");
    btnFooterApply.textContent = "Apply";
    let btnFooterCancel = viewHelper.createElement("button", [
      "btn",
      "btn-outline-secondary",
    ]);
    btnFooterCancel.setAttribute("type", "button");
    btnFooterCancel.setAttribute("data-dismiss", "modal");
    btnFooterCancel.textContent = "Cancel";
    let modalFooter = viewHelper.getElement("#studentModalFooter");
    modalFooter.replaceChildren();
    modalFooter.append(btnFooterCancel, btnFooterApply);

    $("#studentModal").modal("toggle");
  }

  createDataRow(label, value) {
    let row = viewHelper.createElement("div", ["form-group", "row"]);
    let labelColumn = viewHelper.createElement("label", [
      "col-sm-2",
      "col-form-label",
    ]);
    labelColumn.textContent = label;
    let fieldColumn = viewHelper.createElement("div", ["col-sm-10"]);
    let fieldText = viewHelper.createElement("label", [
      "form-control-plaintext",
    ]);
    fieldText.textContent = value;
    fieldColumn.append(fieldText);
    row.append(labelColumn, fieldColumn);
    return row;
  }

  createInputRow(label, name, value) {
    let row = viewHelper.createElement("div", ["form-group", "row"]);
    let labelColumn = viewHelper.createElement("label", [
      "col-sm-2",
      "col-form-label",
    ]);
    labelColumn.textContent = label;
    let fieldColumn = viewHelper.createElement("div", ["col-sm-10"]);
    let fieldText = viewHelper.createElement("input", ["form-control"]);
    fieldText.setAttribute("id", name);
    fieldText.value = value;
    fieldColumn.append(fieldText);
    row.append(labelColumn, fieldColumn);
    return row;
  }

  createSelectRow(label, name, value, data) {
    let row = viewHelper.createElement("div", ["form-group", "row"]);
    let labelColumn = viewHelper.createElement("label", [
      "col-sm-2",
      "col-form-label",
    ]);
    labelColumn.textContent = label;
    let fieldColumn = viewHelper.createElement("div", ["col-sm-10"]);
    let fieldText = viewHelper.createElement("select", ["form-control"]);

    for (var option of data) {
      var opt = document.createElement("option");
      opt.value = option.value;
      opt.innerHTML = option.name;
      fieldText.appendChild(opt);
    }

    fieldText.setAttribute("id", name);
    fieldText.value = value;
    fieldColumn.append(fieldText);
    row.append(labelColumn, fieldColumn);
    return row;
  }

  createDeleteRow(id) {
    let row = viewHelper.createElement("div", ["form-group", "row"]);
    let labelColumn = viewHelper.createElement("label", [
      "col-sm-2",
      "col-form-label",
    ]);
    labelColumn.textContent = "";
    let fieldColumn = viewHelper.createElement("div", ["col-sm-10"]);

    let btnDelete = viewHelper.createElement("button", [
      "btn",
      "btn-secondary",
    ]);
    btnDelete.textContent = "Delete";
    btnDelete.setAttribute("onClick", "app.handleDeleteCard(" + id + ");");

    let btnEdit = viewHelper.createElement("button", ["btn", "btn-secondary"]);
    btnEdit.textContent = "Edit";
    btnEdit.setAttribute("onClick", "app.handleOpenEditCard(" + id + ");");

    fieldColumn.append(btnDelete, btnEdit);
    row.append(labelColumn, fieldColumn);
    return row;
  }

  createAlert(alertText, isWarning) {
    let className = "alert-success";
    if (isWarning) className = "alert-warning";

    let alertPlaceholder = viewHelper.getElement("#alertplaceholder");
    let alert = viewHelper.createElement("div", []);
    let alertTemplate =
      `<div id="alert" class="alert ${className} alert-dismissible" role="alert">` +
      `  ${alertText}` +
      '  <button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
      '    <span aria-hidden="true">&times;</span>' +
      "  </button>" +
      "</div>";
    alert.innerHTML = alertTemplate;
    alertPlaceholder.append(alert);

    //Close the alert after 2 seconds
    window.setTimeout(function () {
      $("#alert").alert("close");
    }, 4000);
  }
}

class StudentController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    const element = document.querySelector("#root");
    element.addEventListener("GetStudentData", function (event) {
      app.handleStudentData(event.detail);
    });
    element.addEventListener("StudentDeleted", function (event) {
      app.handleStudentDeleted(event.detail);
    });
    element.addEventListener("StudentAdded", function (event) {
      app.handleStudentAdded(event.detail);
    });
    element.addEventListener("StudentEdited", function (event) {
      app.handleStudentEdited(event.detail);
    });
    element.addEventListener("Error", function (event) {
      console.log(event.detail);

      app.handleError(event.detail);
    });
  }

  handleStudentData(studentResponse) {
    console.log("create view");
    this.view.createView(studentResponse);
  }

  handleCardClick(id) {
    console.log("modal " + id + " clicked");
    this.view.createStudentModal(id);
  }

  handleAddCardClick(id) {
    console.log("modal - Add New - clicked");
    this.view.createAddStudentModal(id);
  }

  handleSaveStudentClick(id) {
    console.log("Student Save clicked");

    let nameValue = document.getElementById("name").value;
    let classValue = document.getElementById("class").value;
    let majorValue = document.getElementById("major").value;

    this.model.addStudent(id, nameValue, classValue, majorValue);
  }

  handleStudentAdded(data) {
    this.handleSuccess(
      `Student ${data.response.data.name} was added successfully`
    );
    this.model.getStudentData();
    $("#studentModal").modal("toggle");
  }

  handleStudentEdited(data) {
    this.handleSuccess(
      `Student ${data.response.data.name} was edited successfully`
    );
    this.model.getStudentData();
    $("#studentModal").modal("toggle");
  }

  handleDeleteCard(id) {
    console.log("modal " + id + " delete");
    this.model.deleteStudent(id);
  }

  handleStudentDeleted(data) {
    console.log("-----delete me.....", data);
    this.handleSuccess(
      `Student  ${JSON.parse(data.response).data.name} deleted successfully`
    );

    this.model.getStudentData();
    $("#studentModal").modal("toggle");
  }

  handleOpenEditCard(id) {
    console.log("modal - Edit " + id + " - clicked");
    this.view.createEditStudentModal(id);
  }

  handleChangePage(page) {
    this.model.getPage(page);
  }

  handleFilterClick() {
    this.view.createFilterModal();
  }

  handleApplyFilters() {
    let filterClass = document.getElementById("filterClass").value;
    let filterMajor = document.getElementById("filterMajor").value;
    let gpaMin = document.getElementById("filterGpaMin").value;
    let gpaMax = document.getElementById("filterGpaMax").value;
    let filterParameters = {
      class: filterClass,
      major: filterMajor,
      gpamin: gpaMin,
      gpamax: gpaMax,
    };

    let sortBy = document.getElementById("sortBy").value;
    let sortOrder = document.getElementById("sortOrder").value;
    let sortParameters = { sortby: sortBy, sortorder: sortOrder };

    this.model.filterParameters = filterParameters;
    this.model.sortParameters = sortParameters;

    this.model.pageParameters.page = 1;
    this.model.getStudentData();
    $("#studentModal").modal("toggle");
  }

  handleSearchClick() {
    let nameSearch = document.getElementById("nameSearch").value;
    this.model.filterParameters.namesearch = nameSearch;
    this.model.pageParameters.page = 1;
    this.model.getStudentData();
  }

  handleError(errormessage) {
    let isWarning = true;
    this.view.createAlert(errormessage, isWarning);
  }
  handleSuccess(successmessage) {
    let isWarning = false;
    this.view.createAlert(successmessage, isWarning);
  }
}

const app = new StudentController(new StudentModel(), new StudentView());
