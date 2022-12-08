let database
const unitList = [];

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
    printUnit(unitId);
}

function deleteUnit(unitId) {
    $('#unit' + unitId).remove();
    addPoints(-unitList[unitId].totalCost, unitList[unitId].category);
    unitList[unitId] = null;
}

function addUnit(laValue) {
    console.log(laValue);
    if (laValue == "none") {
        return;
    }
    let unitName = laValue;
    var unitCost = "";
    var unitCategory = "";
    var unitObject = {};
    $(database).find("[nombre='" + unitName + "']").each(function() {
        unitCost = $(this).attr('baseCost');
        unitCategory = $(this).attr('category1');
        unitSize = $(this).attr('size');
        unitObject.name = unitName;
        unitObject.baseCost = unitCost;
        unitObject.category = unitCategory;
        unitObject.size = unitSize;
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
//$('#units').on('change', agregarUnidad(this));
$('#units').on('change', function() {
    addUnit(this.value);
});


$(document).ready(function() {
    $.get("WarriorsOfDarkGods.xml", function(xml) {
        database = xml;
        initialize();
    });
});

function addPoints(unitCost, unitCategory) {
    sectionPoints = parseInt(unitCost);
    let total = parseInt($('.points').eq(1).text());
    if (!$.isNumeric(total)) {
        total = 0;
    }
    total += parseInt(unitCost);
    $('.points').text(total);
    if ($.isNumeric((parseInt($('.sectionPoints' + '.' + unitCategory).text())))) {
        sectionPoints += parseInt($('.sectionPoints' + '.' + unitCategory).text())
    }
    $('.sectionPoints' + '.' + unitCategory).text(sectionPoints);
}

function initialize() {
    $(database).find("unit").each(function() {
        var name = $(this).attr('nombre');
        //var category = $(this).attr('category1');
        //var baseCost = $(this).attr('baseCost');
        $("#units").append($('<option>', {
            value: name,
            text: name
        }));
    });
}

function printUnit(unitId) {
    let unit = unitList[unitId];
    let bloqueDeUnidad = '<div class="unitContainer" id="unit' + (unitList.length - 1) + '"><div class="unitIcon"><img src="Logo.jpg"></div><div class="unitTextBox"><div class="unitData"><div class="unitName">' + unit.name + '</div><div class="unitPoints">' + unit.baseCost + '</div></div><div class="unitDescription">Patata</div></div><div class="unitButtons"><div class="copyButton" onclick="copyUnit(' + (unitList.length - 1) + ')">C</div><div class="deleteButton" onclick="deleteUnit(' + (unitList.length - 1) + ')">D</div></div></div>'
    $(".sectionContainer." + unit.category).append(bloqueDeUnidad);
    addPoints(unit.baseCost, unit.category);
}