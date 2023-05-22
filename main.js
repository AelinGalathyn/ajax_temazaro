const url = "https://retoolapi.dev/TxIzJH/customers"

function ListCustomers() {
    $.get(url,
        function (data) {
            console.log(data);
            let html = "";
            data.forEach(Customer => {
                html += `<tr>
                <td>${Customer.id}</td>
                <td>${Customer.name}</td>
                <td>${Customer.address}</td>
                <td>${Customer.email}</td>
                <td><button type="button" onClick="ModifyCustomer(${Customer.id})">Modify</button></td>
                <td><button type="button" onClick="DeleteCustomer(${Customer.id})">X</button</td>
                </tr>`
            })
            $("#ttbody").html(html);
        },
        "json"
    );
}

$(function () {
    ListCustomers();

    $("#save").click(function (event) {
        event.preventDefault();

        const id = $("#id").val();
        const name = $("#name").val();
        const address = $("#address").val();
        const email = $("#email").val();

        if (NameTest(name) && EmailTest(email)) {
            const Customer = {
                id: id,
                name: name,
                address: address,
                email: email
            };
            console.log(Customer);

            $.ajax({
                type: "PUT",
                url: `${url}/${Customer.id}`,
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(Customer),
                success: function (data, textStatus, jqXHR) {
                    if (textStatus === "success") {
                        ListCustomers();
                    }
                },
            });
        }
        else{
            alert("Invalid name or email address!");
        }
    });

    $("#NewCustomer").submit(function (e) {
        e.preventDefault();

        const name = $("#name").val();
        const address = $("#address").val();
        const email = $("#email").val();

        const Customer = {
            name: name,
            address: address,
            email: email
        };

        $.post(url, Customer,
            function (data, textStatus, jqXHR) {
                if (textStatus === "success") {
                    $("#name").val("");
                    $("#address").val("");
                    $("#email").val("");
                    ListCustomers();
                }
            },
            "json"
        );
    });
})

function DeleteCustomer(id) {
    $.ajax({
        type: "DELETE",
        url: `${url}/${id}`,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            if (textStatus === "success") {
                ListCustomers();
            };
        }
    });
}

function ModifyCustomer(id) {
    $.get(`${url}/${id}`,
        function (data, textStatus) {
            if (textStatus === "success") {
                $("#name").val(data.name);
                $("#address").val(data.address);
                $("#email").val(data.email);
                $("#id").val(data.id);
            };
        },
        "json"
    );
}

function NameTest(name) {
    const nameRegex = /^[a-zA-Z ]+$/;
    if (nameRegex.test(name) || name.length < 6) {
        return true;
    }
    return false;
}

function EmailTest(email) {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailRegex.test(email)) {
        return true;
    }
    return false;
}