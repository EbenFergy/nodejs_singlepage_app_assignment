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

class ProfessorModel {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.filterParameters = {};
    this.sortParameters = {};
    this.pageParameters = { page: 1, pagesize: 4 };
    this.getProfessorData();
  }

  getPage(page) {
    this.pageParameters.page = page;
    this.getProfessorData();
  }

  getProfessorData() {
    console.log("In GetProfessor()");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        this.professorResponse = JSON.parse(this.responseText);
        const element = document.querySelector("#root");
        let event = new CustomEvent("GetProfessorData", {
          detail: this.professorResponse,
        });
        element.dispatchEvent(event);
      }
    };

    let pagequery = `page=${this.pageParameters.page}&pagesize=${this.pageParameters.pagesize}`;
    let filterquery = "";
    if (this.filterParameters) {
      if (this.filterParameters.title) {
        filterquery = filterquery + `title=${this.filterParameters.title}`;
      }
      if (this.filterParameters.department) {
        filterquery =
          (filterquery ? filterquery + "&" : "") +
          `department=${this.filterParameters.department}`;
      }
      if (this.filterParameters.namesearch) {
        filterquery =
          (filterquery ? filterquery + "&" : "") +
          `namesearch=${this.filterParameters.namesearch}`;
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

    let url = `http://localhost:3050/api/professors?${query}`;

    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  }

  deleteProfessor(id) {
    console.log("In DeleteProfessor()");
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        const element = document.querySelector("#root");
        let data = { response: this.responseText, professorid: id };
        let event = new CustomEvent("ProfessorDeleted", { detail: data });
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

    let url = `http://localhost:3050/api/professors/${id}`;

    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
  }

  addProfessor(id, nameValue, titleValue, departmentValue) {
    console.log("In addProfessor()");
    console.log(id);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && (this.status == 200 || this.status == 201)) {
        console.log(this.responseText);
        const element = document.querySelector("#root");
        let data = { response: JSON.parse(this.responseText) };
        let event;

        if (id) event = new CustomEvent("ProfessorEdited", { detail: data });
        else event = new CustomEvent("ProfessorAdded", { detail: data });
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

    if (id) url = `http://localhost:3050/api/professors/${id}`;
    else url = `http://localhost:3050/api/professors/`;

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(
      JSON.stringify({
        name: nameValue,
        title: titleValue,
        department: departmentValue,
      })
    );
  }
}

class ProfessorView {
  constructor() {}

  createView(professorResponse) {
    this.professorData = professorResponse.data;
    this.pageParameters = professorResponse.pageparameters;
    this.sortParameters = professorResponse.sortparameters;
    this.filterParameters = professorResponse.filterparameters;

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
      "<h3>Professors</h3>" +
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
    if (this.filterParameters.title)
      filterpillTemplateValue += `<span class="badge badge-pill badge-secondary ml-2">title = ${this.filterParameters.title}</span>`;
    if (this.filterParameters.department)
      filterpillTemplateValue += `<span class="badge badge-pill badge-secondary ml-2">department = ${this.filterParameters.department}</span>`;

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

    //Create Professor Cards
    for (var professor of this.professorData) {
      let card = viewHelper.createElement("div", ["card"]);
      card.setAttribute(
        "onClick",
        "app.handleCardClick(" + professor.id + ");"
      );

      let cardBody = viewHelper.createElement("div", ["card-body"]);
      let cardTitle = viewHelper.createElement("div", ["card-title"]);
      cardTitle.textContent = professor.name;
      let cardText = viewHelper.createElement("p", ["card-text"]);
      cardText.textContent = professor.class;

      cardBody.append(cardTitle, cardText);
      card.append(cardBody);
      cardDeck.append(card);
    }

    if (this.professorData.length == 0)
      cardDeck.innerHTML =
        "<div class='ml-auto mr-auto'>no results match the specified filters</div>";

    return cardDeck;
  }

  createProfessorModal(id) {
    let professor = this.professorData.find((x) => x.id === id);
    let modalTitle = viewHelper.getElement("#professorModalLabel");
    modalTitle.textContent = professor.name;

    let modalButtons = viewHelper.getElement("#professorModalbuttons");
    let modalButtonsTemplate =
      `<button type="button" class="btn btn-outline-secondary" onClick="app.handleDeleteCard(${id});">Delete</button>` +
      `<button type="button" class="btn btn-outline-secondary ml-2" onClick="app.handleOpenEditCard(${id});">Edit</button>`;
    modalButtons.innerHTML = modalButtonsTemplate;

    let titleRow = this.createDataRow("Title", professor.title);
    let departmentRow = this.createDataRow("Department", professor.department);

    let modalBody = viewHelper.getElement("#professorModalBody");
    modalBody.replaceChildren();
    modalBody.append(titleRow, departmentRow);

    let btnFooterClose = viewHelper.createElement("button", [
      "btn",
      "btn-primary",
    ]);
    btnFooterClose.setAttribute("type", "button");
    btnFooterClose.setAttribute("data-dismiss", "modal");
    btnFooterClose.textContent = "Close";
    let modalFooter = viewHelper.getElement("#professorModalFooter");
    modalFooter.replaceChildren();
    modalFooter.append(btnFooterClose);

    $("#professorModal").modal("toggle");
  }

  createAddProfessorModal() {
    let modalTitle = viewHelper.getElement("#professorModalLabel");
    modalTitle.textContent = "Add Professor";

    let modalButtons = viewHelper.getElement("#professorModalbuttons");
    modalButtons.replaceChildren();

    let nameRow = this.createInputRow("Name", "name", "");
    let titleRow = this.createInputRow("Title", "title", "");
    let departmentRow = this.createInputRow("Department", "department", "");

    let modalBody = viewHelper.getElement("#professorModalBody");
    modalBody.replaceChildren();
    modalBody.append(nameRow, titleRow, departmentRow);

    let btnFooterSave = viewHelper.createElement("button", [
      "btn",
      "btn-primary",
    ]);
    btnFooterSave.setAttribute("type", "button");
    btnFooterSave.setAttribute("onclick", "app.handleSaveProfessorClick()");
    btnFooterSave.textContent = "Save";
    let btnFooterCancel = viewHelper.createElement("button", [
      "btn",
      "btn-outline-secondary",
    ]);
    btnFooterCancel.setAttribute("type", "button");
    btnFooterCancel.setAttribute("data-dismiss", "modal");
    btnFooterCancel.textContent = "Cancel";
    let modalFooter = viewHelper.getElement("#professorModalFooter");
    modalFooter.replaceChildren();
    modalFooter.append(btnFooterCancel, btnFooterSave);

    $("#professorModal").modal("toggle");
  }

  createEditProfessorModal(id) {
    let professor = this.professorData.find((x) => x.id === id);
    let modalTitle = viewHelper.getElement("#professorModalLabel");
    modalTitle.textContent = "Edit Professor";

    let modalButtons = viewHelper.getElement("#professorModalbuttons");
    modalButtons.replaceChildren();

    let nameRow = this.createInputRow("Name", "name", professor.name);
    let titleRow = this.createInputRow("Title", "title", professor.title);
    let departmentRow = this.createInputRow(
      "Department",
      "department",
      professor.department
    );

    let modalBody = viewHelper.getElement("#professorModalBody");
    modalBody.replaceChildren();
    modalBody.append(nameRow, titleRow, departmentRow);

    let btnFooterSave = viewHelper.createElement("button", [
      "btn",
      "btn-primary",
    ]);
    btnFooterSave.setAttribute("type", "button");
    btnFooterSave.setAttribute(
      "onclick",
      "app.handleSaveProfessorClick(" + id + ")"
    );
    btnFooterSave.textContent = "Save";
    let btnFooterCancel = viewHelper.createElement("button", [
      "btn",
      "btn-outline-secondary",
    ]);
    btnFooterCancel.setAttribute("type", "button");
    btnFooterCancel.setAttribute("data-dismiss", "modal");
    btnFooterCancel.textContent = "Cancel";
    let modalFooter = viewHelper.getElement("#professorModalFooter");
    modalFooter.replaceChildren();
    modalFooter.append(btnFooterCancel, btnFooterSave);
  }

  createFilterModal() {
    let modalTitle = viewHelper.getElement("#professorModalLabel");
    modalTitle.textContent = "Filters";

    let modalButtons = viewHelper.getElement("#professorModalbuttons");
    modalButtons.replaceChildren();

    let titleValue = this.filterParameters.title
      ? this.filterParameters.title
      : "";
    let departmentValue = this.filterParameters.department
      ? this.filterParameters.department
      : "";
    let sortByValue = this.sortParameters.sortby
      ? this.sortParameters.sortby
      : "";
    let sortOrderValue = this.sortParameters.sortorder
      ? this.sortParameters.sortorder
      : "";

    let titleOptions = [
      { name: "", value: "" },
      { name: "Professor", value: "professor" },
      { name: "Associate Professor", value: "associate professor" },
      { name: "Assistant Professor", value: "assistant professor" },
      { name: "Visiting Professor", value: "visiting professor" },
    ];
    let departmentOptions = [
      { name: "", value: "" },
      { name: "Civil Engineering", value: "civil engineering" },
      { name: "Mathematics", value: "mathematics" },
      { name: "Computer Science", value: "computer science" },
      { name: "Manufacturing Engineering", value: "manufacturing engineering" },
    ];
    let sortByOptions = [
      { name: "", value: "" },
      { name: "Id", value: "id" },
      { name: "Name", value: "name" },
      { name: "Title", value: "title" },
      { name: "Department", value: "department" },
    ];
    let sortOrderOptions = [
      { name: "", value: "" },
      { name: "Ascending", value: "asc" },
      { name: "Descending", value: "desc" },
    ];

    let titleRow = this.createSelectRow(
      "Title",
      "filterTitle",
      titleValue,
      titleOptions
    );
    let departmentRow = this.createSelectRow(
      "Department",
      "filterDepartment",
      departmentValue,
      departmentOptions
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

    let modalBody = viewHelper.getElement("#professorModalBody");
    modalBody.replaceChildren();
    modalBody.append(titleRow, departmentRow, sortByRow, sortOrderRow);

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
    let modalFooter = viewHelper.getElement("#professorModalFooter");
    modalFooter.replaceChildren();
    modalFooter.append(btnFooterCancel, btnFooterApply);

    $("#professorModal").modal("toggle");
  }

  createDataRow(label, value) {
    let row = viewHelper.createElement("div", ["form-group", "row"]);
    let labelColumn = viewHelper.createElement("label", [
      "col-sm-3",
      "col-form-label",
    ]);
    labelColumn.textContent = label;
    let fieldColumn = viewHelper.createElement("div", ["col-sm-9"]);
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
      "col-sm-3",
      "col-form-label",
    ]);
    labelColumn.textContent = label;
    let fieldColumn = viewHelper.createElement("div", ["col-sm-9"]);
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
      "col-sm-3",
      "col-form-label",
    ]);
    labelColumn.textContent = label;
    let fieldColumn = viewHelper.createElement("div", ["col-sm-9"]);
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
      "col-sm-3",
      "col-form-label",
    ]);
    labelColumn.textContent = "";
    let fieldColumn = viewHelper.createElement("div", ["col-sm-9"]);

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

class ProfessorController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    const element = document.querySelector("#root");
    element.addEventListener("GetProfessorData", function (event) {
      app.handleProfessorData(event.detail);
    });
    element.addEventListener("ProfessorDeleted", function (event) {
      app.handleProfessorDeleted(event.detail);
    });
    element.addEventListener("ProfessorAdded", function (event) {
      app.handleProfessorAdded(event.detail);
    });
    element.addEventListener("ProfessorEdited", function (event) {
      app.handleProfessorEdited(event.detail);
    });
    element.addEventListener("Error", function (event) {
      console.log(event.detail);

      app.handleError(event.detail);
    });
  }

  handleProfessorData(professorResponse) {
    console.log("create view");
    this.view.createView(professorResponse);
  }

  handleCardClick(id) {
    console.log("modal " + id + " clicked");
    this.view.createProfessorModal(id);
  }

  handleAddCardClick(id) {
    console.log("modal - Add New - clicked");
    this.view.createAddProfessorModal(id);
  }

  handleSaveProfessorClick(id) {
    console.log("Professor Save clicked");

    let nameValue = document.getElementById("name").value;
    let titleValue = document.getElementById("title").value;
    let departmentValue = document.getElementById("department").value;

    this.model.addProfessor(id, nameValue, titleValue, departmentValue);
  }

  handleProfessorAdded(data) {
    console.log("----professor added.......", data);

    this.handleSuccess(
      `Professor ${data.response.data.name} was added successfully`
    );
    this.model.getProfessorData();
    $("#professorModal").modal("toggle");
  }

  handleProfessorEdited(data) {
    this.handleSuccess(
      `Professor ${data.response.data.name} was edited successfully`
    );
    this.model.getProfessorData();
    $("#professorModal").modal("toggle");
  }

  handleDeleteCard(id) {
    console.log("modal " + id + " delete");
    this.model.deleteProfessor(id);
  }

  handleProfessorDeleted(data) {
    console.log(
      "----professor deleted.......",
      JSON.parse(data.response).data.name
    );
    this.handleSuccess(
      `Professor ${JSON.parse(data.response).data.name} deleted successfully`
    );

    this.model.getProfessorData();
    $("#professorModal").modal("toggle");
  }

  handleOpenEditCard(id) {
    console.log("modal - Edit " + id + " - clicked");
    this.view.createEditProfessorModal(id);
  }

  handleChangePage(page) {
    this.model.getPage(page);
  }

  handleFilterClick() {
    this.view.createFilterModal();
  }

  handleApplyFilters() {
    let filterTitle = document.getElementById("filterTitle").value;
    let filterDepartment = document.getElementById("filterDepartment").value;
    let filterParameters = { title: filterTitle, department: filterDepartment };

    let sortBy = document.getElementById("sortBy").value;
    let sortOrder = document.getElementById("sortOrder").value;
    let sortParameters = { sortby: sortBy, sortorder: sortOrder };

    this.model.filterParameters = filterParameters;
    this.model.sortParameters = sortParameters;

    this.model.pageParameters.page = 1;
    this.model.getProfessorData();
    $("#professorModal").modal("toggle");
  }

  handleSearchClick() {
    let nameSearch = document.getElementById("nameSearch").value;
    this.model.filterParameters.namesearch = nameSearch;
    this.model.pageParameters.page = 1;
    this.model.getProfessorData();
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

const app = new ProfessorController(new ProfessorModel(), new ProfessorView());
