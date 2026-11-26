import crypto from 'crypto'
import Household from '../models/household.js'
import User from '../models/user.js'


export const createHousehold = async (req, res) => {
  try {
    const { name } = req.body

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Household name is required'
      })
    }

    // Generate a unique invitation code
    let inviteCode
    let existingHousehold

    do {
      inviteCode = `UW-${crypto.randomBytes(4).toString('hex').toUpperCase()}`

      existingHousehold = await Household.findOne({ inviteCode })
    } while (existingHousehold)

    // Create household
    const household = await Household.create({
      name: name.trim(),
      inviteCode,
      createdBy: req.userId,
      members: [
        {
          user: req.userId,
          role: 'admin'
        }
      ]
    })

    return res.status(201).json({
      success: true,
      message: 'Household created successfully',
      household
    })

  } catch (error) {
    console.error('Create household error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to create household'
    })
  }
}


export const getHouseholds = async (req, res) => {
  try {
    const households = await Household.find({
      'members.user': req.userId
    }).populate('createdBy', 'name email')

    return res.status(200).json({
      success: true,
      count: households.length,
      households
    })
  } catch (error) {
    console.error('Get households error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch households'
    })
  }
}

export const getHouseholdById = async (req, res) => {
  try {
    const household = await Household.findOne({
      _id: req.params.id,
      'members.user': req.userId
    }).populate('createdBy', 'name email')
     .populate('members.user', 'name email')

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      })
    }

    return res.status(200).json({
      success: true,
      household
    })
  } catch (error) {
    console.error('Get household error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch household'
    })
  }
}


export const addMember = async (req, res) => {
  try {
    const { email } = req.body
    const { id } = req.params

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      })
    }

    const household = await Household.findById(id)

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      })
    }

    const admin = household.members.find(
      member =>
        member.user.toString() === req.userId &&
        member.role === 'admin'
    )

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can add members'
      })
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not registered'
      })
    }

    const alreadyMember = household.members.some(
      member => member.user.toString() === user._id.toString()
    )

    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: 'User is already a member'
      })
    }

    household.members.push({
      user: user._id,
      role: 'member'
    })

    await household.save()

    return res.status(200).json({
      success: true,
      message: 'Member added successfully',
      household
    })

  } catch (error) {
    console.error('Add member error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to add member'
    })
  }
}

export const removeMember = async (req, res) => {
  try {
    const { id, memberId } = req.params

    const household = await Household.findById(id)

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      })
    }

    // Check whether logged-in user is admin
    const admin = household.members.find(
      member =>
        member.user.toString() === req.userId &&
        member.role === 'admin'
    )

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can remove members'
      })
    }

    // Prevent removing the household creator
    if (household.createdBy.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: 'Household creator cannot be removed'
      })
    }

    const memberExists = household.members.some(
      member => member.user.toString() === memberId
    )

    if (!memberExists) {
      return res.status(404).json({
        success: false,
        message: 'Member not found in household'
      })
    }

    household.members = household.members.filter(
      member => member.user.toString() !== memberId
    )

    await household.save()

    return res.status(200).json({
      success: true,
      message: 'Member removed successfully',
      household
    })

  } catch (error) {
    console.error('Remove member error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to remove member'
    })
  }
}


export const updateHousehold = async (req, res) => {
  try {
    const { name } = req.body
    const { id } = req.params

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Household name is required'
      })
    }

    const household = await Household.findById(id)

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      })
    }

    const admin = household.members.find(
      member =>
        member.user.toString() === req.userId &&
        member.role === 'admin'
    )

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update household'
      })
    }

    household.name = name.trim()

    await household.save()

    return res.status(200).json({
      success: true,
      message: 'Household updated successfully',
      household
    })

  } catch (error) {
    console.error('Update household error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to update household'
    })
  }
}

export const leaveHousehold = async (req, res) => {
  try {
    const { id } = req.params

    const household = await Household.findById(id)

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      })
    }

    const memberExists = household.members.some(
      member => member.user.toString() === req.userId
    )

    if (!memberExists) {
      return res.status(404).json({
        success: false,
        message: 'You are not a member of this household'
      })
    }

    if (household.createdBy.toString() === req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Household creator cannot leave. Transfer ownership first.'
      })
    }

    household.members = household.members.filter(
      member => member.user.toString() !== req.userId
    )

    await household.save()

    return res.status(200).json({
      success: true,
      message: 'You left the household successfully'
    })
  } catch (error) {
    console.error('Leave household error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to leave household'
    })
  }
}



export const joinHouseholdByCode = async (req, res) => {
  try {
    const { inviteCode } = req.body

    if (!inviteCode || !inviteCode.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invitation code is required'
      })
    }

    // Find household using invitation code
    const household = await Household.findOne({
      inviteCode: inviteCode.trim().toUpperCase()
    })

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Invalid invitation code'
      })
    }

    // Check whether user is already a member
    const alreadyMember = household.members.some(
      member => member.user.toString() === req.userId
    )

    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: 'You are already a member of this household'
      })
    }

    // Add logged-in user as a member
    household.members.push({
      user: req.userId,
      role: 'member'
    })

    await household.save()

    return res.status(200).json({
      success: true,
      message: 'Joined household successfully',
      household
    })

  } catch (error) {
    console.error('Join household error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to join household'
    })
  }
}
