var Slot = function(data) {
    var self = this;

    self.name = ko.observable(data.name);
    self.siteName = ko.observable(data.siteName);
    self.affLink = ko.observable(data.affLink);
    self.clickCount = ko.observable(data.clickCount);
    self.imgSrc = ko.observable(data.imgSrc);
    self.basicInfo = ko.observableArray(data.basicInfo);
    self.description = ko.observable(data.description);

    self.level = ko.computed(function() {
      if (self.clickCount() >= 20) {
        return 'Top Rated!';
      }else if (self.clickCount() >= 5){
        return 'Highly Rated!';
      }else {
        return '';
      }
    });
}

var filters =  {
  filters: ['All Slots', 'NetEnt','Microgaming', 'Playtech', 'BetSoft', 'Free Spins', 'Wild', 'Bonus Hunt', 'Gamble', 'Below 4% House Edge']
}

var ViewModel = function() {
  var self = this;

  self.filters = ko.observableArray(filters.filters);
  self.slotList = ko.observableArray([]);
  self.currentSlot = ko.observable();
  self.currentFilter = ko.observable("All Slots");

  self.getListItems = function(filter, index){
    if (index === 1) {
      self.slotList.remove(function(item){
        return item.basicInfo()[index] > 4;
      });
      return;
    }
    self.slotList.remove(function(item){
      return item.basicInfo()[index] !== filter;
    });
  }

  self.setSlotList = function(clicked) {
    self.currentFilter(clicked);
    self.slotList.removeAll(); // Empty previous list
    allSlots.forEach(function(slot) { //Recreate slot list
      self.slotList.push(new Slot (slot));
    });

    self.slotList().sort(function(a, b){
      if(a.name() < b.name()) return -1;
      if(a.name() > b.name()) return 1;
      return 0;
    });

    var filter;
    if (clicked === 'All Slots'){
      return;
    }else {
      var index = 0;
      if (clicked === 'Free Spins') {
        index = 3;
        filter = 'Yes';
      }else if (clicked === "Wild") {
        index = 4;
        filter = 'Yes';
      }else if (clicked === "Bonus Hunt"){
        index = 5;
        filter = 'Yes';
      }else if (clicked === "Gamble"){
        index = 6;
        filter = 'Yes';
      }else if (clicked === "Below 4% House Edge") {
        index = 1;
      }else {
        filter = clicked;
      }
      self.getListItems(filter, index);
    }

    self.currentSlot(self.slotList()[0]);
    console.log(self.currentSlot().sites);
  }

  self.setSlotList('All Slots');
  self.currentSlot = ko.observable(self.slotList()[0]);

  self.setCurrentSlot = function(clickedSlot) {
    self.currentSlot(clickedSlot);
  }

  self.incrementCounter = function() {
    self.currentSlot().clickCount(self.currentSlot().clickCount() + 1);
  }
}

ko.applyBindings(new ViewModel());
