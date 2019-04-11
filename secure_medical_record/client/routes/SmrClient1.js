const {createHash} = require('crypto')
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const utf8=require('utf8')
const cmd=require('node-cmd');
const {CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const fs = require('fs')
const fetch = require('node-fetch');
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1')	
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')

FAMILY_NAME='smr'

function hash(v) {
    return createHash('sha512').update(v).digest('hex');
}
var _result=""
class SmrClient1 {
    constructor(userid,type) {
      const privateKeyStrBuf = this.getUserPriKey(userid);
      const privateKeyStr = privateKeyStrBuf.toString().trim();
      const context = createContext('secp256k1');
      const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr);
      this.signer = new CryptoFactory(context).newSigner(privateKey);
      this.publicKey = this.signer.getPublicKey().asHex();
      if(type.localeCompare("patient")==0){
      this.address = hash("smr").substr(0, 6) + hash("patient").substr(0,6)
       + hash(this.publicKey).substr(0,6);
       this.result="";
      }
      else{
      this.address= hash("smr").substr(0,6)+hash("patient").substr(0,6)+hash(this.publicKey).substr(6);
      }
    }
    insert_health_record(data){ 
      var databytes = this.json_to_string(data);
      this._wrap_and_send("insert_record",[databytes]) 
    }
    get_health_record(){
       this.address=this.address+hash("health_record").substr(0,52);
       let data=this._send_to_rest_api(null);
       return data;
    }
    json_to_string(data){
      let y=""
      for(var x in data){
        y+=data[x]+".";
      }
      console.log(cryptr.encrypt(y));
      return cryptr.encrypt(y);
    }  

    getUserPriKey(userid) {
      console.log(userid);
      console.log("Current working directory is: " + process.cwd());
      var userprivkeyfile = '/root/.sawtooth/keys/'+userid+'.priv';
      try{
      return fs.readFileSync(userprivkeyfile);
      }
      catch(err){
        cmd.run('sawtooth keygen '+userid)
        return fs.readFileSync(userprivkeyfile);
      }
    }	

    getUserPubKey(userid) {
      console.log(userid);
      console.log("Current working directory is: " + process.cwd());
      var userpubkeyfile = '/root/.sawtooth/keys/'+userid+'.pub';
      try{
        return fs.readFileSync(userpubkeyfile);
        }
        catch(err){
          cmd.run('sawtooth keygen '+userid)
          return fs.readFileSync(userpubkeyfile);
        }
    }    

    _wrap_and_send(action,values){
      if(action=="insert_record"){
           this.address=this.address+hash("health_record").substr(0,52); 
           console.log("Storing at: " + this.address,this.address.length);
           var inputAddressList = [this.address];
           var outputAddressList = [this.address];           
      }
      let payload=action+","+values[0];
      var enc = new TextEncoder('utf8');
      const payloadBytes = enc.encode(payload);
      const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        familyName: 'smr',
        familyVersion: '1.0',
        inputs: inputAddressList,
        outputs: outputAddressList,
        signerPublicKey: this.signer.getPublicKey().asHex(),
        nonce: "" + Math.random(),
        batcherPublicKey: this.signer.getPublicKey().asHex(),
        dependencies: [],
        payloadSha512: hash(payloadBytes)
        }).finish();
        const transaction = protobuf.Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: this.signer.sign(transactionHeaderBytes),
        payload:payloadBytes
        });
        const transactions = [transaction];
        const batchHeaderBytes = protobuf.BatchHeader.encode({
          signerPublicKey: this.signer.getPublicKey().asHex(),
          transactionIds: transactions.map((txn) => txn.headerSignature),
        }).finish();
        const batchSignature = this.signer.sign(batchHeaderBytes);
        const batch = protobuf.Batch.create({
          header: batchHeaderBytes,
          headerSignature: batchSignature,
          transactions: transactions,
        });
        const batchListBytes = protobuf.BatchList.encode({
          batches: [batch]
        }).finish();
        this._send_to_rest_api(batchListBytes);	
    }

    _send_to_rest_api(batchListBytes){
      if (batchListBytes == null) {
        var geturl = 'http://rest-api:8008/state/'+this.address
        //console.log("Getting from: " + geturl);
        return fetch(geturl, {
          method: 'GET',
        })
        .then((response) => response.json())
        .then((responseJson) => {
          var data = responseJson.data;
          _result=utf8.decode(new Buffer(data, 'base64').toString());
          _result=cryptr.decrypt(_result);
          //console.log(_result)
          _result=_result.split('.');
          return _result;
        })
        .catch((error) => {
          console.error(error);
        }); 	
      }
      else{
        fetch('http://rest-api:8008/batches', {
 	  method: 'POST',
       	  headers: {
	    'Content-Type': 'application/octet-stream'
          },
          body: batchListBytes
	})
	.then((response) => response.json())
	.then((responseJson) => {
          console.log(responseJson);
        })
        .catch((error) => {
 	  console.error(error);
        }); 	
      }
      return _result;
    }
    
 
}
module.exports.SmrClient1 = SmrClient1;
