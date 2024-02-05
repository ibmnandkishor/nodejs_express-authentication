express=require('express')
path=require('path')
phash=require('bcrypt')
student=require('./database')
app=express()
port=3000

app.set('view engine','ejs')
app.use(express.static(path.join(__dirname,'../public')))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/user',(req,res)=>{
    res.render('user')
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',async(req,res)=>{
  try{
      const checkmail=await student.findOne({mail:req.body.mail})
      if(checkmail){
          const checkpass=await phash.compare(req.body.pass,checkmail.pass)
          if(checkpass){
            //   res.send('Login Successful')
               res.render('user')
          }
          else{
              res.send('Incorrect password')
          }
      }
      else{
          res.send('User does not exist')
      }
  }
  catch(error){
      res.send(error)
  }
})


app.post('/register',async(req,res)=>{
  const data={name:req.body.name,
              mail:req.body.mail,
              pass:req.body.pass}
const existinguser=await student.findOne({name:data.name})
if(existinguser){
  res.send('User already exists')
}
else{
  hashp = await phash.hash(data.pass, 2);
        data.pass = hashp;
        const userdata = await student.insertMany(data);
        console.log(userdata)
        //res.send('User saved successfully')
        res.redirect('login')
}
})


app.get('/register',(req,res)=>{
    res.render('register')
})

app.listen(port,()=>{
    console.log("server runing")
})





// encpass=phash.hash(pass,saltRound)
// console.log(encpass)
//   newstudent=new student({name,mail,encpass})
//   studentsave=await newstudent.save()
//   res.redirect('/')