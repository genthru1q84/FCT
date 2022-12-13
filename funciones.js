let database;
let unitList = [];
let unitBeingEdited;

/*propiedades del objeto unidad
nombre
coste base
coste unidad
coste total
numero
categoría
*/

function copyUnit(unitId) {
    unitList.push(unitList[unitId]);
    unitList[unitList.length - 1].id = unitList.length - 1;
    printUnit(unitId);
}

function deleteUnit(unitId) {
    $('#unit' + unitId).remove();
    addPoints(-totalUnitCost(unitList[unitId]), unitList[unitId].category);
    unitList[unitId] = null;
}

function addUnit(laValue) {
    console.log(laValue);
    if (laValue == "none" || laValue == null) {
        return;
    }
    let unitName = laValue;
    var unitCost = "";
    var unitCategory = "";
    var unitObject = {};
    $(database).find("[nombre='" + unitName + "']").each(function() {
        unitCost = parseInt($(this).attr('baseCost'));
        unitCategory = $(this).attr('category1');
        unitSize = $(this).attr('size');
        unitObject.options = [];
        unitObject.id = unitList.length;
        unitObject.optionsPrice = [];
        unitObject.name = unitName;
        unitObject.baseCost = unitCost;
        unitObject.category = unitCategory;
        unitObject.size = unitSize;
        unitObject.minSize = unitSize;
        unitObject.maxSize = $(this).attr('maxSize');
        unitObject.totalCost = unitCost;
        //({ "name": unitName, "baseCost": unitCost, "category": unitCategory, "size": unitSize });
        if ($(this).attr('maxSize')) {
            unitMaxSize = $(this).attr('maxSize');
            unitObject.maxSize = unitMaxSize;
        }
        if ($(this).attr('maxMagic')) {
            unitMaxMagic = $(this).attr('maxMagic');
            unitObject.maxMagic = unitMaxMagic;
        }
        if ($(this).children('Addon').attr('cost')) {
            modelCost = $(this).children('Addon').attr('cost');
            unitObject.modelCost = modelCost;
        }
    })

    unitList.push(unitObject)
    printUnit(unitList.length - 1);
}


$(document).ready(function() {
    $.get("WarriorsOfDarkGods.xml", function(xml) {
        database = xml;
        initialize();
    });
    $('.backButton').on('click', function() {
        $('#editPanel').hide();
    });
    $('#exportButton').on('click', function() {
        exporter();
    });
    $('#formatButton').on('click', function() {
        formatArmy();
    });
    $('#formatBack').on('click', function() {
        closeFormat();
    });
    $('#importButton').on('click', function() {
        importerButton();
    });
    $('#addUnitButton').on('click', function() {
        addUnit($('#units').val());
    });
    $('.sectionTitle').on('click', function() {
        $(this).next().toggle();
        if ($(this).children(".sectionName").text()[0] == "▶") {
            $(this).children(".sectionName").text($(this).children(".sectionName").text().replace("▶", "▼"));
        } else {
            $(this).children(".sectionName").text($(this).children(".sectionName").text().replace("▼", "▶"));
        }
    });
});

function addPoints(unitCost, unitCategory) {
    sectionPoints = parseInt(unitCost);
    let total = parseInt($('.points').eq(1).text());
    if (!$.isNumeric(total)) {
        total = 0;
    }
    if ($.isNumeric((parseInt($('.sectionPoints' + '.' + unitCategory).text())))) {
        sectionPoints += parseInt($('.sectionPoints' + '.' + unitCategory).text())
    }
    $('.sectionPoints' + '.' + unitCategory).text(sectionPoints);
    total = 0;
    $('.sectionPoints').each(function() {
        if ($(this).text() != "") {
            total += parseInt($(this).text());
        }
    });
    $('.points').text(total + "/4500");
}

function initialize() {
    $(database).find("unit").each(function() {
        var name = $(this).attr('nombre');
        $("#units").append($('<option>', {
            value: name,
            text: name
        }));
    });
}

function printUnit(unitId) {
    let unit = unitList[unitId];
    let bloqueDeUnidad = '<div class="unitContainer" id="unit' + (unitList.length - 1) + '"><div class="unitIcon"><img src="' + unit.category + '.png"></div><div class="unitTextBox" onclick="editUnit(' + (unitList.length - 1) + ')"><div class="unitData"><div class="unitName">' + unit.name + '</div><div class="unitPoints">' + totalUnitCost(unit) + '</div></div><div class="unitDescription">' + unitDescription(unit) + '</div></div><div class="unitButtons"><div class="copyButton" onclick="copyUnit(' + (unitList.length - 1) + ')">C</div><div class="deleteButton" onclick="deleteUnit(' + (unitList.length - 1) + ')">D</div></div></div>'
    $(".sectionContainer." + unit.category).append(bloqueDeUnidad);
    addPoints(totalUnitCost(unit), unit.category);
}

function editUnit(unitId) {
    let check = unitList[unitId];
    unitBeingEdited = $.extend(true, {}, check);
    $("#editSection").empty();
    $(".editedUnitCost").text(totalUnitCost(check));
    $(".editedUnitName").text(check.name);

    $(database).find("[nombre='" + check.name + "'] > Addon[type='size']").each(function() {
        $("#editSection").append("<div class='sizeOption'><div class='alteredSize'><input id='actualEditNumber' type='number' name='newSize' min='" + check.minSize + "' max='" + check.maxSize + "' value='" + check.size + "'></div><div class='cost'>" + $(this).attr('cost') + " pts</div><div class='sizeText'><label for='newSize'>Number</label></div></div>");
    });

    $('#actualEditNumber').on('change', function() {
        unitBeingEdited.size = $(this).val();
        unitBeingEdited.totalCost = unitBeingEdited.baseCost + ((unitBeingEdited.size - unitBeingEdited.minSize) * unitBeingEdited.modelCost);
        $(".editedUnitCost").text(totalUnitCost(unitBeingEdited));
    });

    // Booleanos sin seccion
    $(database).find("[nombre='" + check.name + "'] > Addon[type='bool']").each(function() {
        var checked = "";
        if (unitBeingEdited.options.indexOf("Sing - " + $(this).attr('name')) != -1) {
            checked = "checked";
        }
        if ($(this).attr('cost') != "0") {
            costChunk = "<div class='cost'>" + $(this).attr('cost') + "</div>"
        } else {
            costChunk = "";
        }
        $("#editSection").append("<div class='option'><input " + checked + " type='checkbox' id='" + $(this).attr('name') + "' name='" + $(this).attr('name') + "'>" + costChunk + "<label for='" + $(this).attr('name') + "'>" + $(this).attr('name') + "</label></div>");
    });

    // Secciones de booleanos
    sectionNumber = 0;
    $(database).find("[nombre='" + check.name + "'] > Addon[type='dropdown']").each(function() {
        $("#editSection").append(" <div class='booleanOption' id='section" + sectionNumber + "'><div class='optionTitle'>" + $(this).attr("name") + "<div onclick='toggleBoolean(this)'>+</div></div></div>");
        $(this).children('Option').each(function() {
            var checked = "";
            if (unitBeingEdited.options.indexOf($(this).attr('name')) != -1) {
                checked = "checked";
            }
            if ($(this).attr('cost') != "0") {
                costChunk = "<div class='cost'>" + $(this).attr('cost') + "</div>"
            } else {
                costChunk = "";
            }
            $("#section" + sectionNumber).append("<div style='display:none;' class='option'><input " + checked + " type='checkbox' id='" + $(this).attr('name') + "' name='" + $(this).attr('name') + "'>" + costChunk + "<label for='" + $(this).attr('name') + "'>" + $(this).attr('name') + "</label></div>");
        });
        sectionNumber++;
    });

    // Secciones de objetos magicos
    $(database).find("[nombre='" + check.name + "'] > Addon[type='magicItem']").each(function() {
        $("#editSection").append(" <div class='magicOption' id='section" + sectionNumber + "'><div class='optionTitle'>" + $(this).attr("name") + "<div onclick='toggleBoolean(this)'>+</div></div></div>");
        console.log($(this).attr("list"));
        newQuery = $(this).attr("list");
        $(database).find(newQuery).children('Option').each(function() {
            var checked = "";
            if (unitBeingEdited.options.indexOf("Sing - " + $(this).attr('name')) != -1) {
                checked = "checked";
            }
            if ($(this).attr('cost') != "0") {
                costChunk = "<div class='cost'>" + $(this).attr('cost') + "</div>"
            } else {
                costChunk = "";
            }
            $("#section" + sectionNumber).append("<div style='display:none;' class='option'><input " + checked + " type='checkbox' id='" + $(this).attr('name') + "' name='" + $(this).attr('name') + "'>" + costChunk + "<label for='" + $(this).attr('name') + "'>" + $(this).attr('name') + "</label></div>");
        });
        sectionNumber++;
    });

    // Evento para las checkboxes
    $('.option :checkbox').on('change', function(e) {
        var check = false;
        var isSingular = "";
        if ($(this).is(":checked")) {
            check = true;
        }
        if ($(this).parent().parent().attr("class") == "booleanOption") {
            booleanOptionID = $(this).parent().parent().attr("id");
            $("#" + booleanOptionID + " .option :checkbox").each(function() {
                if (unitBeingEdited.options.indexOf($(this).attr("name")) != -1) {
                    $(this).prop("checked", false);
                    unitBeingEdited.optionsPrice.splice(unitBeingEdited.options.indexOf($(this).attr("name")), 1);
                    unitBeingEdited.options.splice(unitBeingEdited.options.indexOf($(this).attr("name")), 1);
                }
            });
        } else {
            isSingular = "Sing - ";
            $("#" + $(this).parent().parent().attr("id") + ".magicOption .option :checkbox").each(function() {
                if (unitBeingEdited.options.indexOf(isSingular + $(this).attr("name")) != -1) {
                    $(this).prop("checked", false);
                    unitBeingEdited.optionsPrice.splice(unitBeingEdited.options.indexOf($(this).attr("name")), 1);
                    unitBeingEdited.options.splice(unitBeingEdited.options.indexOf($(this).attr("name")), 1);
                }
            });
            if (unitBeingEdited.options.indexOf(isSingular + $(this).attr("name")) != -1) {
                $(this).prop("checked", false);
                unitBeingEdited.optionsPrice.splice(unitBeingEdited.options.indexOf(isSingular + $(this).attr("name")), 1);
                unitBeingEdited.options.splice(unitBeingEdited.options.indexOf(isSingular + $(this).attr("name")), 1);
            }
        }
        if (check) {
            $(this).prop("checked", true);
            unitBeingEdited.options.push(isSingular + $(this).attr("name"));
            if ($(this).next().attr("class") == "cost") {
                unitBeingEdited.optionsPrice.push(parseInt($(this).next().text()));
            } else {
                unitBeingEdited.optionsPrice.push(0);
            }
        }
        $(".editedUnitCost").text(totalUnitCost(unitBeingEdited));
    });

    $("#editSection").append('<div id="saveButton" onclick="saveEditedUnit(' + unitBeingEdited.id + ')">Save unit</div>');
    $('#editPanel').show();
}

function toggleBoolean(elem) {
    $(elem).parent().parent().children().each(function() {
        if ($(this).attr("class") != "optionTitle") {
            $(this).toggle();
        }
    });
    if ($(elem).text() != "-") {
        $(elem).text("-");
    } else {
        $(elem).text("+");
    }
}

function totalUnitCost(unit) {
    cost = unit.totalCost;
    for (var i = 0; i < unit.options.length; i++) {
        if (unit.options[i].includes("Sing - ")) {
            cost += unit.optionsPrice[i];
        } else {
            cost += unit.optionsPrice[i] * unit.size;
        }
    }
    return cost;
}

function unitDescription(unit) {
    descr = "";
    for (var i = 0; i < unit.options.length; i++) {
        descr += unit.options[i].replace("Sing - ", "") + ", ";
    }
    return descr.substring(0, descr.length - 2);;
}

function saveEditedUnit(unitId) {
    addPoints(-totalUnitCost(unitList[unitId]), unitList[unitId].category);
    unitList[unitId] = $.extend(true, {}, unitBeingEdited);
    addPoints(totalUnitCost(unitList[unitId]), unitList[unitId].category);
    $("#unit" + unitId + " .unitTextBox").empty();
    $("#unit" + unitId + " .unitTextBox").append('<div class="unitData"><div class="unitName">' + unitBeingEdited.name + '</div><div class="unitPoints">' + totalUnitCost(unitBeingEdited) + '</div></div><div class="unitDescription">' + unitDescription(unitBeingEdited) + '</div>');
    $('#editPanel').hide();
}

// Exporter
function exporter() {
    let outp = JSON.stringify(unitList);
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:attachment/text,' + encodeURI(outp);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'list.ac';
    hiddenElement.click();
}

// Importer
function importerButton() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.ac';
    input.onchange = _this => {
        let files = Array.from(input.files);
        importer(files[0]);
    };
    input.click();
}

function importer(file) {
    const reader = new FileReader();
    $(".sectionContainer").empty();
    reader.addEventListener("load", () => {
        unitList = ""
        unitList = JSON.parse(reader.result);
        for (i = 0; i < unitList.length; i++) {
            printUnit(i);
        }
    }, false);

    if (file) {
        reader.readAsText(file);
    }
}

function formatArmy() {
    formatOutput = "";
    for (var i = 0; i < unitList.length; i++) {
        if (unitList[i] == null) { continue; }
        formatOutput += totalUnitCost(unitList[i]) + " - " + unitList[i].name;
        for (var j = 0; j < unitList[i].options.length; j++) {
            optionName = unitList[i].options[j];
            if (unitList[i].options[j].includes("Sing - ")) {
                optionName = unitList[i].options[j].replace("Sing - ", "");
            }
            formatOutput += ", " + optionName;
        }
        formatOutput += "<br>";
    }
    $("#formatText").html(formatOutput + "<div id='formatBack' onclick='closeFormat()' ><img src='back.jpg'></div>");
    $("#formatPopUp").show();
}

function closeFormat() {
    $("#formatPopUp").hide();
}