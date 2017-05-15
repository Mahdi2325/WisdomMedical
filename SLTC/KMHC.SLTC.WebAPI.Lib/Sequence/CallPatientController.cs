using System;
using System.Web.Http;
using KM.Common;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model.Sequence;
using KMHC.SLTC.Business.Interface.baiduTTS;
using KMHC.SLTC.Business.Interface.Sequence;
using KMHC.SLTC.WebAPI.Lib.Attribute;
using KMHC.SLTC.WebAPI.Lib.Hubs;
using Microsoft.AspNet.SignalR;
using System.Collections.Concurrent;
using System.Threading;

namespace KMHC.SLTC.WebAPI.Lib.Sequence
{
    [RoutePrefix("api/CallPatient"), RoleBaseAuthorize]
    public class CallPatientController : BaseApiController
    {
        static CallPatientController()
        {
            Time_Task.Instance().ExecuteTask += new System.Timers.ElapsedEventHandler(ExecuteTask);
            Time_Task.Instance().Interval = 1000 * 25;//表示间隔
            Time_Task.Instance().Start();
        } 
        /// <summary>
        /// 全局队列
        /// </summary>
        public static ConcurrentQueue<PersonQueue> _ConcurrenPersons = new ConcurrentQueue<PersonQueue>();

        ISequenceService service = IOCContainer.Instance.Resolve<ISequenceService>();

        [Route("GetPatientQueue")]
        [HttpGet]
        public IHttpActionResult GetPatientQueue([FromUri]BaseRequest<PatientQueueModel> request)
        {
            var response = service.GetPatientQueueForCallPatient(request);
            return Ok(response);
        }

        [Route("UpdatePatientStatus"),HttpPost]
        public IHttpActionResult UpdatePatientStatus([FromBody]PatientQueueModel patient)
        {
            var response = service.UpdatePatientStatus(patient);

            IBaiduTTSService baiduService = IOCContainer.Instance.Resolve<IBaiduTTSService>();
            var ctx = GlobalHost.ConnectionManager.GetHubContext<ScreenDisplayHub>();

            var dbPatient = service.GetCheckRoomName(patient);
            if (dbPatient == null) dbPatient = patient;

            var broadcartContent = "请 " + dbPatient.SerialNumber+"号 " + dbPatient.ResidentName + "到" + dbPatient.DeptName +
                                   dbPatient.CheckRoomName + "诊室就诊！";

            var url = baiduService.GetBaiduUri(broadcartContent);

            //入列：
            PersonQueue Model = new PersonQueue(broadcartContent,url);
            PersonEnqueue(Model);

            //ctx.Clients.Group("12345678").clientAddGroupMessage(broadcartContent, url);


            return Ok(response);
        }

        [Route("SetPatientExpired"),HttpPost]
        public IHttpActionResult SetPatientQueueExpired([FromBody] PatientQueueModel patient)
        {
            var response = service.SetPatientQueueExpired(patient);
            return Ok(response);
        }

        [Route("SetPatientFinish"), HttpPost]
        public IHttpActionResult SetPatientCheckFinish([FromBody] PatientQueueModel patient)
        {
            var response = service.SetPatientCheckFinish(patient);
            return Ok(response);
        }

        /// <summary>
        /// 入队
        /// </summary>
        public void PersonEnqueue(PersonQueue Model)
        {
            _ConcurrenPersons.Enqueue(Model);
        }

        /// <summary>
        /// 出列
        /// </summary>
        public void PersonDequeue()
        {
            if (_ConcurrenPersons.Count > 0)
            {
                bool dequeueSuccesful = false;
                bool peekSuccesful = false;
                PersonQueue workItem;

                peekSuccesful = _ConcurrenPersons.TryPeek(out workItem);

                if (peekSuccesful)
                {
                    var ctx = GlobalHost.ConnectionManager.GetHubContext<ScreenDisplayHub>();
                    ctx.Clients.Group("12345678").clientAddGroupMessage(workItem.broadcartContent, workItem.url);
                    Thread.Sleep(10000);
                    ctx.Clients.Group("12345678").clientAddGroupMessage(workItem.broadcartContent, workItem.url);
                    dequeueSuccesful = _ConcurrenPersons.TryDequeue(out workItem);//出队
                }
            }
        }




        /// <summary>
        /// 回调函数
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        static void ExecuteTask(object sender, System.Timers.ElapsedEventArgs e)
        {
            new CallPatientController().PersonDequeue();
        }
    }

    public class Time_Task
    {
        public event System.Timers.ElapsedEventHandler ExecuteTask;

        private static readonly Time_Task _task = null;
        private System.Timers.Timer _timer = null;


        //定义时间
        private int _interval = 1000;
        public int Interval
        {
            set
            {
                _interval = value;
            }
            get
            {
                return _interval;
            }
        }

        static Time_Task()
        {
            _task = new Time_Task();
        }

        public static Time_Task Instance()
        {
            return _task;
        }

        //开始
        public void Start()
        {
            if (_timer == null)
            {
                _timer = new System.Timers.Timer(_interval);
                _timer.Elapsed += new System.Timers.ElapsedEventHandler(_timer_Elapsed);
                _timer.Enabled = true;
                _timer.Start();
            }
        }

        protected void _timer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            if (null != ExecuteTask)
            {
                ExecuteTask(sender, e);
            }
        }

        //停止
        public void Stop()
        {
            if (_timer != null)
            {
                _timer.Stop();
                _timer.Dispose();
                _timer = null;
            }
        }

    }
}
