<script setup>

</script>



<template>
  <div></div>
  <div class="main_counter_home"> 
    <div class="counter_home_title">
  <p>Сообщите о проблеме с ЖКХ, благоустройством,<br> состояния дорог и другими</p></div>
  <div >
  <button class="counter_home_button"> Подать заявку</button></div>
  <src></src>  
  </div>
  <div class="main_counter_panel">
    <div class="counter_panel">
      <div class="counter_count">34287</div>  
      <div class="counter_title">Сообщений поступило</div>
    </div>
    <div class="counter_panel">
      <div class="counter_count">35665</div>
      <div counter_title>Проблем решено</div>
    </div>
    <div class="counter_panel">
      <div class="counter_count">3453</div>
      <div counter_title>Принято в работу обращений</div>
    </div>
    </div>


  <h1>Решенные проблемы</h1>
   <div class="main_counter_complet">
    
    <div class="counet_complet">
      <div class="counet_complet_img">(я картинка) </div>
      <div class="counet_complet_title">Разбитые стекла в парадной</div>
      </div>
      <div class="counet_complet">
      <div class="counet_complet_img">(я картинка) </div>
      <div class="counet_complet_title">Засор мусоропровода</div>
      </div>
      <div class="counet_complet">
      <div class="counet_complet_img">(я картинка) </div>
      <div class="counet_complet_title">Ямы во дворе</div>
      </div>
    </div>
    
    
</template>


<style scoped>
.main_counter_home{
  position: relative;
  font-size: 35px;
}
.counter_home_button{
  font-size: 25px;
  
}

.main_counter_panel{
  position: relative;
  display: flex;
  justify-content: center;
  margin-left: 70px;
  margin-right: 70px;
  margin-top: 30px;
  font-size: 27px;
  border: 4px solid black;
  border-radius: 11px;
}
.counter_panel{
  padding: 50px;

}


.main_counter_complet{
  position: relative;
   display: flex;
  justify-content: center;
   margin-left: 70px;
  margin-right: 70px;
  font-size: 27px;
  
}
.counet_complet{
  padding: 50px;
}
.counter_home_button{
background-color: #028AD2 ;
    border-radius: 11px;
    color: black;
    text-decoration: none;
    
    text-align: center;
    font-size: 28px;
    transition: all 0.3s linear;
}
.counter_home_button:hover {
    
    background-color: #006194;
    color: #f3f3f3;
}

</style>