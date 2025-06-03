import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAxiosPublic from '../hooks/useAxiosPublic';
import { useAuth } from '../providers/AuthProvider';
import Swal from 'sweetalert2';

const GroupTasksList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        if (!user?.email) {
          setLoading(false);
          return;
        }

        // Get groups where user is either admin or member
        const response = await axiosPublic.get(`/groups/user/${user.email}`);
        const groupsData = response.data.map(group => ({
          ...group,
          members: Array.isArray(group.members) ? group.members : []
        }));
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load groups. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [axiosPublic, user]);

  const handleDeleteGroup = async (groupId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        await axiosPublic.delete(`/groups/${groupId}`, {
          data: { userEmail: user.email }
        });
        setGroups(groups.filter(group => group._id !== groupId));
        Swal.fire('Deleted!', 'Group has been deleted.', 'success');
      }
    } catch (error) {
      console.error('Error deleting group:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete group. Please try again later.',
      });
    }
  };

  const handleKickMember = async (groupId, memberEmail) => {
    try {
      const result = await Swal.fire({
        title: 'Kick Member',
        text: `Are you sure you want to kick ${memberEmail}? They will lose access to this group until invited again.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, kick member'
      });

      if (result.isConfirmed) {
        await axiosPublic.patch(`/groups/${groupId}/kick`, { 
          memberEmail,
          userEmail: user.email 
        });
        
        // Update local state
        setGroups(groups.map(group => {
          if (group._id === groupId) {
            return {
              ...group,
              members: group.members.filter(member => member !== memberEmail)
            };
          }
          return group;
        }));

        // Update selected group if it's the one being modified
        if (selectedGroup && selectedGroup._id === groupId) {
          setSelectedGroup(prev => ({
            ...prev,
            members: prev.members.filter(member => member !== memberEmail)
          }));
        }

        Swal.fire('Kicked!', 'Member has been removed from the group.', 'success');
      }
    } catch (error) {
      console.error('Error kicking member:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to kick member. Please try again later.',
      });
    }
  };

  const handleLeaveGroup = async (groupId) => {
    try {
      const result = await Swal.fire({
        title: 'Leave Group',
        text: 'Are you sure you want to leave this group?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, leave group'
      });

      if (result.isConfirmed) {
        await axiosPublic.patch(`/groups/${groupId}/leave`, { userEmail: user.email });
        setGroups(groups.filter(group => group._id !== groupId));
        Swal.fire('Left!', 'You have left the group.', 'success');
      }
    } catch (error) {
      console.error('Error leaving group:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to leave group. Please try again later.',
      });
    }
  };

  const handleManageMembers = (group) => {
    setSelectedGroup(group);
    setShowManageModal(true);
  };

  const handleUpdateRole = async (memberEmail, newRole) => {
    try {
      const result = await Swal.fire({
        title: 'Change Role',
        text: `Are you sure you want to make ${memberEmail} ${newRole}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, change role'
      });

      if (result.isConfirmed) {
        await axiosPublic.patch(`/groups/${selectedGroup._id}/role`, {
          memberEmail,
          newRole,
          userEmail: user.email
        });

        // Update local state
        setGroups(groups.map(group => {
          if (group._id === selectedGroup._id) {
            return {
              ...group,
              adminEmail: newRole === 'admin' ? memberEmail : group.adminEmail
            };
          }
          return group;
        }));

        Swal.fire('Updated!', 'Member role has been updated.', 'success');
      }
    } catch (error) {
      console.error('Error updating member role:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update member role. Please try again later.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Group Tasks</h1>
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <Link to="/" className="btn btn-sm sm:btn-md bg-black btn-outline flex-1 sm:flex-none text-xs sm:text-sm">
              Back to Home
            </Link>
            <Link to="/tasks/create" className="btn btn-sm sm:btn-md btn-primary flex-1 sm:flex-none text-xs sm:text-sm">
              Create New Group
            </Link>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <h2 className="text-lg sm:text-xl text-gray-600 mb-3 sm:mb-4">No groups found</h2>
            <Link to="/tasks/create" className="btn btn-sm sm:btn-md btn-primary text-xs sm:text-sm">
              Create Your First Group
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {groups.map((group) => (
              <div
                key={group._id}
                className="bg-white rounded-lg shadow-md p-3 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg sm:text-xl text-black font-semibold mb-1 sm:mb-2 line-clamp-1">{group.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">
                  Admin: {group.adminEmail === user?.email ? 'You' : group.adminEmail}
                </p>
                {group.members && group.members.length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">Members:</p>
                    <ul className="text-xs sm:text-sm text-gray-600">
                      {group.members.map((member) => (
                        <li key={member} className="flex justify-between items-center mb-1">
                          <span className="line-clamp-1">{member}</span>
                          {group.adminEmail === user?.email && member !== user?.email && (
                            <button
                              onClick={() => handleKickMember(group._id, member)}
                              className="text-white hover:text-red-700 text-xs btn btn-xs btn-error ml-2"
                            >
                              Kick
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
                  <Link
                    to={`/groups/${group._id}`}
                    className="btn btn-xs sm:btn-sm btn-primary flex-1 sm:flex-none text-xs sm:text-sm"
                  >
                    View Tasks
                  </Link>
                  {group.adminEmail === user?.email ? (
                    <>
                      <Link
                        to={`/groups/${group._id}/create`}
                        className="btn btn-xs sm:btn-sm btn-secondary flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        Add Task
                      </Link>
                      <button
                        onClick={() => handleManageMembers(group)}
                        className="btn btn-xs sm:btn-sm btn-info flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        Manage Members
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group._id)}
                        className="btn btn-xs sm:btn-sm btn-error flex-1 sm:flex-none text-xs sm:text-sm"
                      >
                        Delete Group
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleLeaveGroup(group._id)}
                      className="btn btn-xs sm:btn-sm btn-error flex-1 sm:flex-none text-xs sm:text-sm"
                    >
                      Leave Group
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Manage Members Modal */}
        {showManageModal && selectedGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 text-black">
            <div className="bg-white rounded-lg p-3 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Manage Members - {selectedGroup.name}</h3>
              <div className="space-y-2 sm:space-y-4">
                {/* Show admin first */}
                <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-medium line-clamp-1">{selectedGroup.adminEmail}</span>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Admin</span>
                  </div>
                  {selectedGroup.members.length > 1 && (
                    <button
                      onClick={() => handleUpdateRole(selectedGroup.adminEmail, 'member')}
                      className="btn btn-xs btn-warning text-xs"
                    >
                      Make Member
                    </button>
                  )}
                </div>
                
                {/* Show other members */}
                {selectedGroup.members
                  .filter(member => member !== selectedGroup.adminEmail)
                  .map((member) => (
                    <div key={member} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-medium line-clamp-1">{member}</span>
                      </div>
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={() => handleUpdateRole(member, 'admin')}
                          className="btn btn-xs btn-info text-xs"
                        >
                          Make Admin
                        </button>
                        {member !== user?.email && (
                          <button
                            onClick={() => handleKickMember(selectedGroup._id, member)}
                            className="btn btn-xs btn-error text-white text-xs"
                          >
                            Kick
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-4 sm:mt-6 flex justify-end">
                <button
                  onClick={() => setShowManageModal(false)}
                  className="btn btn-xs sm:btn-sm text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupTasksList; 