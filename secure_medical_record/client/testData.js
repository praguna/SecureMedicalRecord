var { SmrClient1 } =require("./routes/SmrClient1");

var cmd=require("node-cmd");
cmd.run('sawtooth keygen 5ca688591df84c0018e8e565')
var SmrClient1=new SmrClient1("5ca688591df84c0018e8e565",'patient')
//var client=SmrClient1.insert_health_record({height:"100kg",weight:"109cm"});
var client=SmrClient1.get_health_record();