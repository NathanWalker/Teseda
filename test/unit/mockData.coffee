angular.module("MockData", []).factory "MockDataService", ($rootScope, $controller) ->
	
	api = {}
	
	api.initCtrl = (ctrlName, params) ->
		params.$scope = $rootScope.$new()
		# switch ctrlName
		# 	when 'NeededService'
		# 		params.neededSerivce = InjectedService
		# 	else
		$controller ctrlName, params
		params.$scope

	api.logListeners = (s) ->
		console.log(s.$$listeners)
	api.logScope = (s) ->
		console.log(Object.keys(s))

	api.data =
		AboutCtrl:
			default:
				resources:
					project:
						id: 1
						name: "Anything"
					show:
						id: 2
						data: [
							id:3
							content: "Twice Anything"
						]
		AccountCtrl:
			default:
				resources:
					project:
						id: 1
						name: "Test"
					show:
						id: 1
						type: "address"
						street: "275 Skyline Pkwy"
						city: "Athens"
						state: "GA"
						zip: "31606"
					index: [
						id: 1
						type: "address"
						street: "275 Skyline Pkwy"
						city: "Athens"
						state: "GA"
						zip: "31606"
					,
						id: 1
						type: "address"
						street: "275 Skyline Pkwy"
						city: "Athens"
						state: "GA"
						zip: "31606"
					]
			userInput:
				name: "Malino Oda"
				email: "malino.oda@bizbuilt.com"
				login: "nathan"
				password: "mario1"
				password_confirmation: "mario1"

		ContactCtrl:
			contacts:
				tel:
					id:451
					name: 'Mobile Phone'
					type: 'contact_asset'
					value: '808-808-8888'
					visibility: 'Public'
				email:
					id:391
					name: 'WorkEmail'
					type: 'contact_asset'
					value: 'malino.oda@bizbuilt.com'
					visibility: 'Public'
				website:
					id: 494
					name: "Personal Website"
					type: "contact_asset"
					value: "http://www.odahale.com"
					visibility: "public"
				city:
					id: 194
					name: "City"
					type: "contact_asset"
					value: "Salem"
					visibility: "private"
				state:
					id: 333
					name: "State"
					type: "contact_asset"
					value: "Oregon"
					visibility: "private"
		CloudCtrl:
			default:{}

		DashboardCtrl:
			user1: 
				id: 1
				name: "test"
				wraps: [
					id: 1
					name: "test"
				]
		DiscussionCtrl:
			default:
				resources:{}
		
		EditCtrl:{}

		FileCtrl:
			default:
				resources:
					project:
		          id: 1
		          name: "Test"
		        show:
		          id: 1
		          data: [
		            id: 1
		            name: "file 1"
		          ,
		            id: 2
		            name: "file 2"
		          ]
		          tags: [
		            id: 4
		            name: "documents"
		            path: "documents"
		          ]
		FileDetailCtrl:
			result:
				editable: true
				index: undefined
				file:
					id: 1
					mime_type: "image/jpeg"
					name: "2011_-_2013_Contract_Vote__2011_BOD_Elections__Pension_Enhancement"
					size_bytes: null
					type: "file_asset"
					url: "https://www.filepicker.io/api/file/sWQ6Dn5CS32aEQmzrPlx?signature=43e7c43bf4de2e236b451597c86617292d7c139822861d6093f810a05fc3a7f4&policy=eyJjYWxsIjpbInJlYWQiLCJjb252ZXJ0Il0sImhhbmRsZSI6InNXUTZEbjVDUzMyYUVRbXpyUGx4IiwiZXhwaXJ5IjoiMTM2OTMxMDc0OSJ9"
					visibility: "private"
		LocationCtrl:
			default:
				resources:
					index:{}
					project:{}
					show:{}
		LoginModalCtrl:
			defaultLogin:
				login: 'nathan'
				password: 'mario1'
			defaultAccount:
				active: true
				auth_token: "55gEkMlFEkETIHoDvApg"
				connection_request_total: 0
				created_at: "2013-05-22T12:03:52Z"
				default_card_id: 11
				email: "nathan.walker@infowrap.com"
				id: 11
				info1: "UI Designer"
				info2: "InfoWrap"
				jailed: false
				login: "nathan"
				name: "Nathan Walker"
				org_flow_step: "done"
				organization_id: 1
				storage_limit_bytes: 2147483648
				storage_used_bytes: 0
			errorLogin:
				login: 'malino'
				password: 'mario1'
		RequestsCtrl:
			default:{}
		ShareCtrl:
			default:{}
		WrapsCtrl:
			default:{}

		AssetMod:
			options:{}

	api







