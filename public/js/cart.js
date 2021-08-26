const root=location.protocol+"//"+location.host
$('.addCart').click(function(event) {
    // var root = window.location.href
    console.log(root);
    event.preventDefault()
    const href = this.href
    $.ajax({
        url: href,
        type: 'get',
        data: {},
        success: function(data) {
            swal("Add successful!", "continute!", "success")
            $('#infoNumber').load(root + ' #numberCart')
        }
    })
})

$('.changeCart').click(function(event) {
    event.preventDefault()
    const href = this.href
    const data = href.split('/')
    const id = data[data.length - 1]
    const qty = '#qty' + id
    console.log(qty);
    console.log(id);
    $.ajax({
        url: href,
        type: 'get',
        data: {},
        success: function(data) {
            //swal("Edit successful!", "continute!", "success")
            $('#' + id).load(root + "/cart " + qty)
            $("#total1").load(root + "/cart #total2")
            $('#infoNumber').load(root + ' #numberCart')
        }
    })
})


