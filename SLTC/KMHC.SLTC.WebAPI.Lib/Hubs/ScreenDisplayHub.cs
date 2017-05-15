using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;

namespace KMHC.SLTC.WebAPI.Lib.Hubs
{
    public class ScreenDisplayHub : Hub
    {
        public void ServerAddGroup(String GroupId)
        {
            Groups.Add(Context.ConnectionId, GroupId);
        }
        public void ServerGroupSend(String GroupId, String Message)
        {

            Clients.Group(GroupId).clientAddGroupMessage(GroupId, Message);

        }
    }
}
