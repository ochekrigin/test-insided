(function ($) {
    var body = $('body'),
        dropDownCollection = body.find('.dropdown'),
        dropDownOpener = body.find('[data-dropdown-opener]'),
        checkboxCollectionParent = body.find('[data-checkbox-parent]'),
        collectionOfCheckbox = checkboxCollectionParent.find('input[type="checkbox"]'),
        btnCheckAllCheckboxCollection = checkboxCollectionParent.find('[data-check-all]'),
        checkboxCheckAllCheckboxCollection = checkboxCollectionParent.find('[data-check-item]'),
        btnUncheckAllCheckboxCollection = checkboxCollectionParent.find('[data-uncheck-all]'),
        searchBox = body.find('[data-search]'),
        category = body.find('[data-category]'),
        categoryButtonBox = body.find('[data-category-box]'),
        categoryCollection = category.find('input[type="checkbox"]'),
        addRowBtn = searchBox.find('[data-add-search-row]'),
        deleteRowBtn = searchBox.find('[data-row-delete]'),
        dropdownList = body.find('.dropdown-list'),
        dropdownListCollection = dropdownList.find('a'),
        datePicker = body.find('.datepicker-here'),
        btnClearCategory = body.find('[data-clear-category]'),
        btnHiddenClass = 'hidden',
        hiddenClass = 'dropdown-box-hidden',
        selectedClass = 'selected',
        checkedClass = 'checked',
        classActive = 'active';

    addRowBtn.on('click', function () {
       var currentItem = $(this),
           currentRowParent = currentItem.closest('[data-search]'),
           currentActiveRowCollection = currentRowParent.find('[data-search-row]').not('.dropdown-box-hidden'),
           lastActiveItem = $(currentActiveRowCollection[[currentActiveRowCollection.length-1]]);
        lastActiveItem.next('[data-search-row]').removeClass(hiddenClass);
    });

    btnClearCategory.on('click', function (e) {
        e.preventDefault();
        categoryButtonBox.find('.btn-box').remove();
        category.find('input[type="checkbox"]').prop("checked", false);
        categoryButtonBox.addClass(btnHiddenClass);
    });

    categoryCollection.on('change', function () {
        var currentCheckbox = $(this),
            currentText = currentCheckbox.siblings('label').text(),
            template = '<div class="btn-box"><button type="button" class="btn btn-cross">' + currentText +'</button></div>';
        if (currentCheckbox.prop("checked") === true) {
            categoryButtonBox.prepend(template);
            categoryButtonBox.removeClass(btnHiddenClass);
        } else {
            categoryButtonBox.find('.btn-cross').filter(function (index, item) {
                if ($(item).text() === currentText) {
                    return $(item);
                }
            }).closest('.btn-box').remove();
        }
        body.find('.btn-cross').on('click', function (e){
            e.preventDefault();
            var currentText = $(this).text();
            category.find('input[type="checkbox"]').filter(function (index, item) {
                if ($(item).siblings('label').text() === currentText) {
                    return $(item);
                }
            }).prop("checked", false);
            $(this).closest('.btn-box').remove();
        });
    });

    datePicker.datepicker({
        onHide: function(inst, animationCompleted) {
            var closestParentRow = $(inst.el).closest('[data-search-row]');
            $(inst.el).closest('.dropdown').removeClass(classActive).addClass(checkedClass);
            showBtnDelete(closestParentRow);
        },
        onShow: function(inst, animationCompleted) {
            $(inst.el).closest('.dropdown').addClass(classActive);
        }
    })

    deleteRowBtn.on('click', function (e) {
        e.preventDefault();
        var currentBtn = $(this),
            currentDropdownCollection = currentBtn.closest('[data-search-row]').find('.dropdown');
        currentBtn.closest('[data-search-row]').addClass(hiddenClass);
        currentDropdownCollection.each(function (){
            $(this).removeClass(checkedClass);
        });
    });

    dropDownOpener.on('click', function () {
       var currentItem = $(this),
           currentParrent = currentItem.closest('.dropdown');
       if (currentParrent.hasClass(classActive)) {
           currentParrent.removeClass(classActive);
       } else {
           dropDownCollection.removeClass(classActive);
           currentParrent.addClass(classActive);
       }
    });

    dropdownListCollection.on('click', function (e) {
        e.preventDefault();
        var curItem = $(this),
            curDropdown = curItem.closest('.dropdown'),
            curDropdownBtn = curDropdown.find('[data-dropdown-opener]'),
            closestRow = curDropdown.closest('[data-search-row]'),
            dropdownCollection = closestRow.find('.dropdown'),
            curText = curItem.text();
        curDropdownBtn.html(curText);
        curDropdown.removeClass(classActive);
        if (closestRow.length) {
            var checkedCollection,
                currentBtnDelete = closestRow.find('[data-row-delete]');
            curDropdown.closest('.col').next('.col').find('[data-dropdown-opener]').attr('disabled', false);
            curDropdown.addClass(checkedClass);
            showBtnDelete(closestRow);
        }
    });

    btnCheckAllCheckboxCollection.on('click', function (e) {
        e.preventDefault();
        var currentLink = $(this),
            currentCheckboxParent = currentLink.closest('[data-checkbox-parent]');
        checkAllCheckbox(currentCheckboxParent, true);
    });

    btnUncheckAllCheckboxCollection.on('click', function (e) {
        e.preventDefault();
        var currentLink = $(this),
            currentCheckboxParent = currentLink.closest('[data-checkbox-parent]');
        checkAllCheckbox(currentCheckboxParent, false);
    });

    collectionOfCheckbox.on('change', function () {
        var currentItem = $(this),
            currentCheckboxParent = currentItem.closest('[data-checkbox-parent]');

        if (isCheckedItems(currentCheckboxParent)) {
            currentCheckboxParent.addClass(classActive);
        } else {
            currentCheckboxParent.removeClass(classActive);
        }

        if (currentItem.closest('tr').length) {
            if (currentItem.prop("checked") === true) {
                currentItem.closest('tr').addClass(selectedClass);
            } else {
                currentItem.closest('tr').removeClass(selectedClass);
            }
        }

        if (currentItem.closest('[data-search-row]').length) {
            currentItem.closest('.dropdown').addClass(checkedClass);
            showBtnDelete(currentItem.closest('[data-search-row]'));
        }

        if (currentItem.attr('data-check-item') === 'true') {
            if (currentItem.prop("checked") === true) {
                checkAllCheckbox(currentCheckboxParent, true);
                addClass(currentCheckboxParent, true);
            } else {
                checkAllCheckbox(currentCheckboxParent, false);
                currentCheckboxParent.removeClass(classActive);
                addClass(currentCheckboxParent, false);
            }
        }
    });

    function addClass(checkboxParent, flag) {
        var trCollection = checkboxParent.find('tr');
        if (flag) {
            trCollection.each(function () {
                $(this).addClass(selectedClass);
            });
        } else {
            trCollection.each(function () {
                $(this).removeClass(selectedClass);
            });
        }
    }

    function isCheckedItems (checkboxParent) {
        return (checkboxParent.find('input[type="checkbox"]:checked').length) ? true : false;
    }

    function checkAllCheckbox (checkboxParent, flag) {
        var checkboxCollection = checkboxParent.find('input[type="checkbox"]');
        if (flag) {
            checkboxCollection.prop("checked", true);
        } else {
            checkboxCollection.prop("checked", false);
        }
    }

    function showBtnDelete (parentRow) {
        var checkedCollection = parentRow.find('.checked'),
            dropdownCollection = parentRow.find('.dropdown'),
            currentBtnDelete = parentRow.find('[data-row-delete]');
        if (checkedCollection.length === dropdownCollection.length) {
            currentBtnDelete.removeClass(btnHiddenClass);
        }
    }

})(jQuery);
