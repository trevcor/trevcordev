trevcordev = {
	init:  function(){
		this.buildTemplates();
		this.bindUI();
	},
	buildTemplates:  function(){
		this.portfolioItems();
	},
	portfolioItems:  function(){
		//console.log('Begin Portfolio Build');
		var source   = $("#portfolio-template").html();
		var template = Handlebars.compile(source);
		var context = $.getJSON('assets/data/portfolio.json', function(data) {
				//console.log(data);
				var html=template(data);
				//console.log(html);
				$('.portfolio-container').append(html);
				//console.log(super.this);
				$('.item:first-child').addClass('active');
				$('.carousel').carousel({
					interval:  10000
				});
			});
	},
	bindUI:  function(){
		var $this=this;
		$('#right-rail').affix({
			offset: { top:270}
		});

		$('.tagline').on('click',function(){
			$('form:not(.filter) :input:visible:first').focus();
		});

		//console.log('active carousel');
		$this.validateForm.init('frmContact');

		$("#frmContact").submit(function(e){
			var valid=false;
			e.stopPropagation();
			valid=$this.validateForm.validateAll(this.id);
			console.log('Valid:  ' + valid);

			if (valid){
				$.ajax({
					type: "POST",
					url: "mail.php",
					data: $("#frmContact").serialize(),
					dataType: "json",
					success: function(msg){
						$("#frmContact").hide();
						$("#messageContainer").removeClass('error');
						$("#messageContainer").removeClass('success');
						$("#messageContainer").addClass(msg.status);
						$("#messageContainer").html(msg.message);
					},
					error: function(){
						$("#messageContainer").removeClass('success');
						$("#messageContainer").addClass('error');
						$("#messageContainer").html("There was an error submitting the form. Please try again.");
					}
				});
			}
			//make sure the form doesn't post
			return false;
		});
	},
	validateForm:  {
		valid: true,
		inputs: [],
		init: function(formId){
			$this=this; //validatForm Obj
			$('#' + formId + ' input, #' + formId + ' textarea').each(function(){
				$(this).blur(function(that){
					$this.validate(this);
				});
				$(this).keyup(function(that){
					if($this.validateEmpty($(this))){
						$this.errorPrompt.hide($(this));
					}
				});
			});
		},
		validateAll:  function(formId){
			$this=this;
			$('#' + formId + ' input, #' + formId + ' textarea').each(function(){
				$this.validate(this);
			});
			//console.log(this.valid);
			return this.valid;
		},
		validate:  function(obj){
			var vMsg='';
			
			if ($(obj).attr('data-validate-null') && !this.validateEmpty(obj)){
				vMsg=$(obj).attr('data-validate-null');
			}
			else if ($(obj).attr('data-validate-email')&& !this.validateEmail(obj)){
				//console.log('Need Email Validation');
				this.errorPrompt.hide(obj);
				vMsg=$(obj).attr('data-validate-email');
			}
			else if ($(obj).attr('data-validate-phone')&& !this.validatePhone(obj)){
				//console.log('Need Email Validation');
				this.errorPrompt.hide(obj);
				vMsg=$(obj).attr('data-validate-phone');
			}
			if (vMsg.length){
				this.valid=false;
				this.errorPrompt.show(obj,vMsg);
			}else{
				this.valid=true;
				this.errorPrompt.hide(obj);
			}
		},
		errorPrompt: {
			show: function(obj,vMessage){
				if (!$(obj).parent('.control-group').hasClass('error')){
					$(obj).parent('.control-group').addClass('error');
					$(obj).popover('destroy');
					$(obj).popover({
							content:  vMessage,
							template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><div class="popover-content"><p></p></div></div></div>',
							trigger:  'manual'
							})
						.popover('show');
					$('.popover').addClass('btn-danger');
					$('.arrow').addClass('danger-arrow');
				}
			},
			hide: function(obj){
				$(obj).parent('.control-group').removeClass('error');
				$(obj).popover('destroy');
			}
		},
		validateEmail: function(input){
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if ( re.test($(input).val())){
				return true;
			}
			else{
				return false;
			}
		},
		validatePhone: function(input){
			var re=/^(?!.*-.*-.*-)(?=(?:\d{8,10}$)|(?:(?=.{9,11}$)[^-]*-[^-]*$)|(?:(?=.{10,12}$)[^-]*-[^-]*-[^-]*$)  )[\d-]+$/;
			if ( re.test($(input).val())){
				return true;
			}
			else{
				return false;
			}
		},
		validateEmpty: function(input){
			if ($(input).val().length){
				return true;
			}
			else{
				return false;
			}
		},
		validateLength: function(value,n){
			return true;
		}
	},
	bindCarousel:  function(){
		$('.carousel').carousel();
	}
};

$(document).ready(function () {
	//console.log('Ready');
	trevcordev.init();
});