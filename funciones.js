let database
let unitId = 0;

function agregarUnidad(laValue) {
    if (laValue.value == "none") {
        return;
    }
    let unitName = laValue.value;
    var unitCost = "";
    var unitCategory = "";
    $(database).find("[nombre='" + unitName + "']").each(function() {
        unitCost = $(this).attr('baseCost');
        unitCategory = $(this).attr('category1');
    })
    unitId++;
    let bloqueDeUnidad = '<div class="unitContainer" id="unit' + unitId + '"><div class="unitIcon"><img src="Logo.jpg"></div><div class="unitTextBox"><div class="unitData"><div class="unitName">' + unitName + '</div><div class="unitPoints">' + unitCost + '</div></div><div class="unitDescription">Capua</div></div><div class="unitButtons"><div>C</div><div>D</div></div></div>'
    $("." + unitCategory).append(bloqueDeUnidad);

}
//$('#units').on('change', agregarUnidad(this));

$('#units').on('change', function() {
    agregarUnidad(this);
});


$(document).ready(function() {
    $.get("WarriorsOfDarkGods.xml", function(xml) {
        database = xml;
        initialize();
    });
});

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