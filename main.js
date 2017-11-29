  Vue.component('feed-button', {
  props:['order'],
      data: function() {
        return {showModal: false,
          // order: this.order,
        order_details: [{test:'test'}]
  }},
  template:`<div v-if="order.feedback_submitted"></div>
      <div style="display: inline-block" v-else>
        <!-- <button v-on:click=""> Feedback </button> -->
        <button @click="showModal = true; getOrderDetails() ">Feedback</button>
        <modal v-if="showModal" :order_id="order" :order_details=order_details @close="showModal = false">
          <h3 slot="header">Hello Beautiful!</h3>
        </modal>
      </div>`,
  methods:{
  getOrderDetails: function() {
  var id  = this.order.id
  this.$http.get(`https://ordiez.herokuapp.com/orders/${id}`).then(response => {
    this.order_details = response.body;
  }, response => {
    console.log('error')
  })
  }
  }//end methods
  })

  Vue.component('modal', {
  // template: '#modal-template'
     props: ['order_id', 'order_details'],
     data: function () {
       return { id: this.order_id,
                detailed_order: this.order_details,
                mealfeedbacks: [],
                delivery: '',
                sentStatus:''
        }
     },
  template: `    <transition name="modal">
        <div class="modal-mask" id="vueApp">
          <div class="modal-wrapper">
            <div class="modal-container">
              <div class="modal-header">
              </div>
              <div class="modal-body" >
                <slot name="body">
                  <p style="color:red;">{{sentStatus}}</p>
                  {{order_id.delivery_time}}
                  {{order_id.delivery_date}}
                  {{order_id.order_id}}

                  <div class="form-group" id="myForm" name="myForm">
                    <label for="delivery">How was our Delivery?</label>
                    <input type="text" class="form-control" value="" v-model="delivery" />

                    <ul><li v-for="(item, index) in order_details.order_items">
                    <label for="">How was our {{item.name}}?</label>
                    <input type="text" class="form-control" value="" v-model="item.value" />
                  </li></ul>
                  </div>
                 <button class="modal-default-button" @click="sendFeedback">
                   submit
                 </button>
                </slot>
              </div>
              <div class="modal-footer">
                <slot name="footer">
                  <button class="modal-default-button" @click="$emit('close')">
                    X
                  </button>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition>`
      ,
    methods:{
      sendFeedback: function() {
        this.order_details.order_items.forEach((item)=>{
          var id = item.id
          var value = item.value
          // console.log(id, value);
          value? this.mealfeedbacks.push({id, value}): ""
        })
        console.log(this.mealfeedbacks, "this.mealfeedbacks");
        feedbacks:this.mealfeedbacks
        delivery: this.delivery
        var id  = this.id.id
        this.$http.post(`https://ordiez.herokuapp.com/orders/${id}/feedbacks`,
        {delivery:this.delivery, feedbacks:this.mealfeedbacks})
        .then ((response) => {
          response.ok? this.sentStatus = "Your feedback was submitted, thanks!" : ""
        },response => {
          this.sentStatus = "Your feedback could not be submitted at this time"
          console.log('oops errors!');
          console.log(response.statusText);
        })
    }}
  })
