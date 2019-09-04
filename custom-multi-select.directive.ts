import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';
declare function setTimeout(param: any, param2: any): void;
declare function toString(param: any): any;
declare var $: any;

@Directive({
  selector: 'appCustomMultiSelect'
})
export class CustomMultiSelectDirective {

  constructor(private el: ElementRef) { }
  @Output('ondragged') ondragged = new EventEmitter();
  @Output('onItemSelected') onItemSelected = new EventEmitter();
  @Input('auto_select_options') auto_select_options;

  @Input() set options(items: any) {
    this.Initialization(items, this.auto_select_options, this.ondragged, this.onItemSelected)
  }

  Initialization(inputItems, auto_select_options, ondragged, onItemSelected) {
    let options = inputItems;

    let DirectiveId = Math.random().toString(36).substring(7);
    let createElement = function (tag, parent, uniqueClassName = [], commonClass = [], styles = {}) {
      let ele = document.createElement(tag);
      for (let i = 0; i < uniqueClassName.length; i++) {
        ele.classList.add(DirectiveId + "-" + uniqueClassName[i])
      }
      for (let i = 0; i < commonClass.length; i++) {
        ele.classList.add(commonClass[i])
      }
      let properties = Object.keys(styles);
      let values = Object.values(styles);
      for (let i = 0; i < properties.length; i++) {
        ele.style[properties[i]] = values[i]
      }
      if (parent) {
        parent.appendChild(ele)
      }
      return ele;
    }

    let custom_multi_select = createElement("div", false, [], ["custom-multi-select"], {
      position: "relative",
      width: "100%"
    })
    let custom_multi_select_button = createElement("div", custom_multi_select, [], ["custom_multi_select_button"], {
      backgroundColor: "none",
      color: "black",
      width: "100%",
      padding: "10px",
      zIndex: "-1",
      border: "solid black 1px",
      borderRadius: "10px",
      maxHeight: "40px"

    })

    let selectedOptionsEle = createElement("span", custom_multi_select_button, [], [], {
      minHeight: "40px",
      display: "inline-block",
      maxHeight: "40px",
      color: "white"
    })
    selectedOptionsEle.innerHTML = "select";

    let caretButton = createElement("button", custom_multi_select_button, [], ['caretButton'], {
      position: "absolute",
      right: "0",
      top: "7px",
      background: "none",
      border: "0",
      fontSize: "20px"
    })

    let caret = createElement("i", caretButton, [], ['fa', 'fa-caret-down'])

    caretButton.addEventListener("click", function (event) {

      if (custom_multi_select_dropdown.style.display == "none") {
        custom_multi_select_dropdown.style.display = "block";
        caretButton.innerHTML = "";
        caret = createElement("i", caretButton, [], ['fa', 'fa-caret-up'])

        console.log(custom_multi_select_dropdown.style.display)
      }
      else {
        custom_multi_select_dropdown.style.display = "none";
        caretButton.innerHTML = "";

        caret = createElement("i", caretButton, [], ['fa', 'fa-caret-down'])

        console.log("class added")
      }
      event.stopPropagation()
    })

    let custom_multi_select_dropdown = createElement("div", custom_multi_select, [], ["custom-multi_select-dropdown"], {
      width: "100%",
      background: "white",
      color: "black",
      border: "solid black 2px",
      position: "absolute",
      zIndex: "100"
    })
    custom_multi_select_dropdown.style.display = "none";
    let custom_multi_select_select_all = createElement("div", custom_multi_select_dropdown, [], ["custom-multi-select-select-all"], {
      //borderBottom : "solid #ccc 1px",
      padding: "10px",
      fontSize: "10px",
    })

    let select_all_checkbox = createElement("input", custom_multi_select_select_all, [])
    select_all_checkbox.setAttribute("type", "checkbox");

    let select_all_label = createElement("label", custom_multi_select_select_all, [], [], {
      float: "right",
      display: "inline-block"

    })
    select_all_label.innerHTML = "select all";


    let search_filter = createElement("input", custom_multi_select_dropdown, [], ["custom-multi-select-input"], {
      width: "100%",
      padding: "3px",
      fontSize: "10px"
    })
    search_filter.focus();
    let multi_select_options = createElement("div", custom_multi_select_dropdown, [], ["custom-multi-select-options"], {
      maxHeight: "200px",
      overflowY: "auto"
    })


    let ul = createElement("ul", multi_select_options, [], [], {
      padding: "0",
      margin: "0",
      listStyleType: "none"
    })
    ul.setAttribute("id", DirectiveId + "-" + "sortable")
    let selected_options = [];
    let change_select_allStatus = function () {
      select_all_checkbox_status = !select_all_checkbox_status;
    }
    let manageSelectAll = function () {
      selected_options = [];
      let eles: any = document.getElementsByClassName(DirectiveId + "-" + "option-item");
      if (select_all_checkbox_status) {
        selectedOptionsEle.innerHTML = null;
        for (let i = 0; i < eles.length; i++) {
          eles[i].checked = true;
          itemAdded(eles[i].getAttribute("data-id"), false)
        }
      }
      else {
        for (let i = 0; i < eles.length; i++) {
          eles[i].checked = false;
          itemRemove(eles[i].getAttribute("data-id"), false)
        }
        selected_options = [];
        selectedOptionsEle.innerHTML = "select";

      }
      onItemSelected.emit(selected_options)
    }
    let optiotionElementsIntialize = function () {
      let eles2: any = document.getElementsByClassName(DirectiveId + "-" + "option-item");

      for (let i = 0; i < eles2.length; i++) {

        eles2[i].addEventListener('click', function (event) {

          if (!this.checked) {
            select_all_checkbox.checked = false;
            select_all_checkbox_status = false;
            itemRemove(this.value)

          }
          else {
            itemAdded(this.value)
          }
          event.stopPropagation()

        })
      }

    }
    let ploatOptions = function (items) {
      ul.innerHTML = "";
      for (let i = 0; i < items.length; i++) {
        let li = createElement("li", ul, [], [], {
          padding: "10px",
          fontSize: "10px",
        })
        // let li = document.createElement("li");
        li.setAttribute("class", DirectiveId + "-option-list")
        li.setAttribute("id", items[i].item_key)

        let checkbox = createElement("input", li, [], [], {

        })
        let sort = createElement("i", li, [], ["fas", "fa-sort"], {
          float: "right",
          cursor: "pointer",
        })

        checkbox.setAttribute("type", "checkbox")
        checkbox.setAttribute("data-id", items[i].item_key)
        checkbox.setAttribute("id", DirectiveId + "-" + "checkbox-" + items[i].item_key)
        checkbox.setAttribute("value", items[i].item_key)
        checkbox.classList.add(DirectiveId + "-" + "option-item")

        let label = createElement("label", li, [], [], {
          marginLeft: "10px"
        })
        label.innerHTML = items[i].item_value

      }
      setTimeout(optiotionElementsIntialize, 500)
      setTimeout(manageSelectAll, 1000)
      $(function () {
        $("#" + DirectiveId + "-" + "sortable").sortable();
        $("#" + DirectiveId + "-" + "sortable").disableSelection();
        $("#" + DirectiveId + "-" + "sortable li").droppable({
          drop: function () {
            setTimeout(function () {
              ondragged.emit(getOrderedOptions());
            }, 500)

          }
        });
      });
    }
    let getOrderedOptions = function () {
      let orderedOptionsElements: any = document.getElementsByClassName(DirectiveId + "-option-list");
      let orderedOptions = []
      for (let i = 0; i < orderedOptionsElements.length; i++) {
        let item: any = {}
        if (orderedOptionsElements[i].childNodes[0]) {
          item.item_key = orderedOptionsElements[i].childNodes[0].value
          item.item_value = orderedOptionsElements[i].childNodes[1].innerHTML;
          orderedOptions.push(item)
        }
      }
      return orderedOptions;

    }
    let auto_select = function () {
      for (let i = 0; i < auto_select_options.length; i++) {
        let id = DirectiveId + "-checkbox" + "-" + auto_select_options[i].item_key;

        document.getElementById(id).click()

      }
    }



    ploatOptions(options);

    let select_all_checkbox_status = false

    select_all_checkbox.addEventListener('click', function (event) {
      change_select_allStatus()
      manageSelectAll()
      event.stopPropagation()
    })


    search_filter.addEventListener('click', function () {
      event.stopPropagation();
    })

    search_filter.addEventListener("keyup", function (event) {

      let updatedOptions = options.filter(optionsFilter)
      let updatedOptionsKeys = [];
      let eles: any = document.getElementsByClassName(DirectiveId + "-option-list");
      for (let i = 0; i < updatedOptions.length; i++) {
        updatedOptionsKeys.push(updatedOptions[i]['item_key'].toString())
      }

      for (let i = 0; i < eles.length; i++) {

        if (updatedOptionsKeys.indexOf(eles[i].getAttribute('id').toString()) == -1) {
          eles[i].style.display = "none";
        }
        else {
          eles[i].style.display = "block";
        }
      }

    })


    let optionsFilter = function (item) {
      if (item['item_value'].indexOf(search_filter.value) == -1) {
        return false;
      }
      else {
        return true;
      }
    }


    let prev_selected_options: any;
    //let selectedOptionsEle = document.getElementById("selected-options");
    let itemAdded = function (itemKey, straight = true) {
      prev_selected_options = JSON.stringify(selected_options);
      let item = getItemUsingItemKey(itemKey);
      selected_options.push(item)
      if (selected_options.length == 1) {
        selectedOptionsEle.innerHTML = null;
      }

      if (selected_options.length <= 3) {
        let badge = createElement("label", selectedOptionsEle, [], ['badge'], {
          display: "inline-block",
          background: "#294E7F",
          color: "white",
          padding: "2px",
          border: "solid white 1px",
          borderRadius: "5px",
          fontSize: "10px"
        })
        let badgeSpan = createElement("span", badge, [])
        badgeSpan.innerHTML = item.item_value

        let badgeRemoveDiv = createElement("i", badge, []);
        let badgeRemove = createElement("i", badgeRemoveDiv, [], [], {
          marginLeft: "10px",
          cursor: "pointer",
        });
        badgeRemove.innerHTML = "x"

        badgeRemoveDiv.setAttribute("data-id", itemKey)
        badgeRemoveDiv.addEventListener("click", itemRemovedfromBadge)


        badge.setAttribute("id", DirectiveId + "-badge-" + itemKey)
      }
      else {
        if (document.getElementsByClassName(DirectiveId + "-totalselectedbadge").length > 0) {
          document.getElementsByClassName(DirectiveId + "-totalselectedbadge")[0].innerHTML = "+" + (selected_options.length - 3)
        }
        else {
          let badge = createElement("label", selectedOptionsEle, ['totalselectedbadge'], ['badge'], {
            display: "inline-block",
            background: "#294E7F",
            color: "white",
            padding: "2px",
            border: "solid white 1px",
            borderRadius: "5px",
            fontSize: "10px"
          })
          let badgeSpan = createElement("span", badge, [])
          badgeSpan.innerHTML = "+1";
          console.log("363")
        }

      }

      if (straight === true) {
        onItemSelected.emit(selected_options)
      }

    }
    let itemRemove = function (itemKey, straight = true) {


      prev_selected_options = JSON.stringify(selected_options);
      selected_options = removeByAttr(selected_options, 'item_key', itemKey)
      adjustViewSelected(document.getElementById(DirectiveId + "-badge-" + itemKey))



      if (straight === true) {
        onItemSelected.emit(selected_options)
      }
    }

    let itemRemovedfromBadge = function (event) {


      let chekedele: any = document.getElementById(DirectiveId + "-" + "checkbox-" + this.getAttribute("data-id"));
      chekedele.checked = false;
      prev_selected_options = JSON.stringify(selected_options);
      selected_options = removeByAttr(selected_options, 'item_key', this.getAttribute("data-id"))

      if (selected_options.length == 0) {
        selectedOptionsEle.innerHTML = "select";
      }
      select_all_checkbox_status = false;
      select_all_checkbox.checked = false;
      onItemSelected.emit(selected_options)
      adjustViewSelected(document.getElementById(DirectiveId + "-badge-" + this.getAttribute("data-id")))

      event.stopPropagation()
    }

    let adjustViewSelected = function (ele) {
      if (ele) {
        let child = ele
        let parent = child.parentElement
        let childNodes = parent.childNodes;
        let iterTimes = 0;
        let elementFound = false;
        if (selected_options.length >= 3) {
          for (let i = 0; i < childNodes.length; i++) {
            if (child === childNodes[i] && iterTimes < 3) {
              child.childNodes[0].innerHTML = selected_options[2].item_value;
              child.childNodes[1].setAttribute('data-id', selected_options[2].item_key)
              child.setAttribute("id", DirectiveId + "-badge-" + selected_options[2].item_key)
              elementFound = true;
              break;
            }
            iterTimes = iterTimes + 1
          }

          if (!elementFound) {
            ele.remove()
          }
        }
        else {
          ele.remove()
        }
        if (selected_options.length == 0) {
          selectedOptionsEle.innerHTML = "select";
        }
        if (selected_options.length <= 3) {
          if (document.getElementsByClassName(DirectiveId + "-totalselectedbadge")[0]) {
            document.getElementsByClassName(DirectiveId + "-totalselectedbadge")[0].remove()
          }

        }
        if (document.getElementsByClassName(DirectiveId + "-totalselectedbadge").length > 0) {
          if (selected_options.length > 3) {
            document.getElementsByClassName(DirectiveId + "-totalselectedbadge")[0].innerHTML = "+" + (selected_options.length - 3)
          }
        }


      }
    }
    var removeByAttr = function (arr, attr, value) {
      var i = arr.length;
      while (i--) {
        if (arr[i]
          && arr[i].hasOwnProperty(attr)
          && (arguments.length > 2 && arr[i][attr] === value)) {

          arr.splice(i, 1);

        }
      }
      return arr;
    }

    let getItemUsingItemKey = function (itemKey) {
      itemKey = itemKey;
      for (let i = 0; i < options.length; i++) {
        if (options[i].item_key == itemKey) {
          return options[i];
        }
      }

    }
    setTimeout(auto_select, 2000)
    this.el.nativeElement.appendChild(custom_multi_select)

    document.getElementsByTagName("body")[0].addEventListener("click", function () {
      let dropdowns: any = document.getElementsByClassName("custom-multi_select-dropdown");
      for (let i = 0; i < dropdowns.length; i++) {
        dropdowns[i].style.display = "none";
      }
      let caretButtons: any = document.getElementsByClassName("caretButton");
      for (let i = 0; i < caretButtons.length; i++) {
        caretButtons[i].innerHTML = "";
        caret = createElement("i", caretButtons[i], [], ['fa', 'fa-caret-down'])
      }
    })

    return custom_multi_select;




  }



}
