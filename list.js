$(document).ready(function() {
    $('h3').on('click', function() {
        $(this).next().toggle();
        if ($(this).text()[0] == "▶") {
            $(this).text($(this).text().replace("▶", "▼"));
        } else {
            $(this).text($(this).text().replace("▼", "▶"));
        }
    });
});