var apiKey = ""; // insert your apiKey
var url = 'https://api.novaposhta.ua/v2.0/json/';

var senderCityRef = '';
var receiverCityRef = '';

var senderOptions = {
	url: function(phrase) {
	  return url;
	},
  
	getValue: function(element) {
		return element.MainDescription;
	},

	template: {
		type: "description",
		fields: {
			description: "Present"
		}
	},

	list: {
		onChooseEvent: function() {
			senderCityRef = $("#senderCity").getSelectedItemData().Ref;
			$.ajax({
				url: url,
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				data: JSON.stringify({
					"modelName": "AddressGeneral",
					"calledMethod": "getWarehouses",
					"methodProperties": {
						"SettlementRef": senderCityRef
					},
					"apiKey": apiKey
				}),
				success: function (response) {
					$('#senderOffice')
						.find('option')
						.remove()
						.end()
					$.each(response.data, function(key, value) {
						$('#senderOffice')
							.append($("<option></option>")
								.attr("value",value.Ref)
								.text(value.Description));
					});
				},
				error: function () {
					console.log('error loading offices');
				}
			});
		}
	},

	listLocation: function(response) {
		return response.data[0].Addresses;
	},
  
	ajaxSettings: {
		dataType: "json",
		method: "POST",
		data: {
			dataType: "json"
		}
	},
  
	preparePostData: function(data) {
		data = JSON.stringify({
			"apiKey": apiKey,
			"modelName": "Address",
			"calledMethod": "searchSettlements",
			"methodProperties": {
				"CityName": $("#senderCity").val(),
				"Limit": 5
			}
		});
	  	return data;
	},
  
	requestDelay: 400
};

var receiverOptions = {
	url: function(phrase) {
	  return url;
	},
  
	getValue: function(element) {
		return element.MainDescription;
	},

	template: {
		type: "description",
		fields: {
			description: "Present"
		}
	},

	list: {
		onChooseEvent: function() {
			receiverCityRef = $("#receiverCity").getSelectedItemData().Ref;
			$.ajax({
				url: url,
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				data: JSON.stringify({
					"modelName": "AddressGeneral",
					"calledMethod": "getWarehouses",
					"methodProperties": {
						"SettlementRef": receiverCityRef
					},
					"apiKey": apiKey
				}),
				success: function (response) {
					$('#receiverOffice')
						.find('option')
						.remove()
						.end();
					$.each(response.data, function(key, value) {
						$('#receiverOffice')
							.append($("<option></option>")
								.attr("value",value.Ref)
								.text(value.Description));
					});
				},
				error: function () {
					console.log('error loading offices');
				}
			});
		}
	},

	listLocation: function(response) {
		return response.data[0].Addresses;
	},
  
	ajaxSettings: {
		dataType: "json",
		method: "POST",
		data: {
			dataType: "json"
		}
	},
  
	preparePostData: function(data) {
		data = JSON.stringify({
			"apiKey": apiKey,
			"modelName": "Address",
			"calledMethod": "searchSettlements",
			"methodProperties": {
				"CityName": $("#receiverCity").val(),
				"Limit": 5
			}
		});
	  	return data;
	},
  
	requestDelay: 400
  };

$("#senderCity").easyAutocomplete(senderOptions);
$("#receiverCity").easyAutocomplete(receiverOptions);

$("#buttonCalculate").click(function(e) {
	$('#calcResult').val('');
	$('#dateResult').val('');
	$.ajax({
		url: url,
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify({
			"modelName": "InternetDocument",
			"calledMethod": "getDocumentPrice",
			"methodProperties": {
			"CitySender": senderCityRef,
			"CityRecipient": receiverCityRef,
			"Weight": "5",
			"ServiceType": "WarehouseWarehouse",
			"Cost": "1000",
			"CargoType": "Cargo",
			"SeatsAmount": "1"
			},
			"apiKey": apiKey,
		}),
		success: function (response) {
			if (response.success == true) {
				$('#calcResult').val(response.data[0].Cost);
			} else {
				$('#calcResult').val('');
			}
		},
		error: function (error) {
			console.log(error);
		}
	});
	$.ajax({
		url: url,
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
		data: JSON.stringify({
			"modelName": "InternetDocument",
			"calledMethod": "getDocumentDeliveryDate",
			"methodProperties": {
				"ServiceType": "WarehouseWarehouse",
				"CitySender": senderCityRef,
				"CityRecipient": receiverCityRef
			},
			"apiKey": apiKey,
		}),
		success: function (response) {
			if (response.success == true) {
				$('#dateResult').val(response.data[0].DeliveryDate.date.split(" ")[0]);
			} else {
				$('#dateResult').val('');
			}
		},
		error: function (error) {
			console.log(error);
		}
	});
});