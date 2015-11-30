$.ajax({
        method: "GET",
        url: "/foundbyoptions",
    })
    .done(function(foundByOptions) {
        var htmlString = "";

        for(var i = 0; i < foundByOptions.length; i++){
            htmlString += '<input type="checkbox" name="selectedOptions" value="' +
                foundByOptions[i].foundby_id +'">' +
                '&nbsp;' + foundByOptions[i].name +
                '<br />';

            //htmlString += '<option value="' +
            //    foundByOptions[i].foundby_id + '">' +
            //    foundByOptions[i].name + '</option>';
        }

        $('#foundByOptions').html(htmlString);
    });