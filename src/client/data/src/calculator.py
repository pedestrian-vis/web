# Assisting calculation for drawing the environment
def middle_coordinates(a, b):
    middle = []
    middle.append((a[0] + b[0])/2)
    middle.append((a[1] + b[1])/2)
    print middle

def away_from_center(a, ref, ratio):
    b = [(a[0] - ref[0]) * ratio + ref[0], (a[1] - ref[1]) * ratio + ref[1]]
    print b

def stretch_line(a, b, ratio):
    middle = []
    middle.append((a[0] + b[0])/2)
    middle.append((a[1] + b[1])/2)
    a1 = []
    a1.append(middle[0] + ratio * (a[0] - middle[0]))
    a1.append(middle[1] + ratio * (a[1] - middle[1]))
    b1 = []
    b1.append(middle[0] + ratio * (b[0] - middle[0]))
    b1.append(middle[1] + ratio * (b[1] - middle[1]))
    print str(a1) + ',' + str(b1)

def move_line_along(a, b, ref_a, ref_b, ratio):
    x_move = ratio * (ref_a[0] - ref_b[0])
    y_move = ratio * (ref_a[1] - ref_b[1])
    a_transform = [a[0] + x_move, a[1] + y_move]
    b_transform = [b[0] + x_move, b[1] + y_move]
    print str(a_transform) + ',' + str(b_transform)

def move_point_along(a, ref_a, ref_b, ratio):
    a1 = [a[0] + (ref_b[0] - ref_a[0]) * ratio, a[1] + (ref_b[1] - ref_a[1]) * ratio]
    print str(a1) + ','

def move_obj_along(list, ref_a, ref_b, ratio):
    for el in list:
            transform = [el[0] + (ref_b[0] - ref_a[0]) * ratio, el[1] + (ref_b[1] - ref_a[1]) * ratio]
            print str(transform) + ','

def three_from_stopline(a_stop, b_stop, ref_a, ref_b, ratio):
    a1 = [a_stop[0] + (b_stop[0] - a_stop[0])/3, a_stop[1] + (b_stop[1] - a_stop[1])/3]
    a2 = [a_stop[0] + 2 * (b_stop[0] - a_stop[0])/3, a_stop[1] + 2 * (b_stop[1] - a_stop[1])/3]
    b1 = [a1[0] + ratio * (ref_b[0] - ref_a[0]), a1[1] + ratio * (ref_b[1] - ref_a[1])]
    b2 = [a2[0] + ratio * (ref_b[0] - ref_a[0]), a2[1] + ratio * (ref_b[1] - ref_a[1])]
    print str(a1) + ', ' + str(b1)
    print str(a2) + ', ' + str(b2)

def four_from_stopline(a_stop, b_stop, ref_a, ref_b, ratio):
    a1 = [a_stop[0] + (b_stop[0] - a_stop[0])/4, a_stop[1] + (b_stop[1] - a_stop[1])/4]
    a2 = [a_stop[0] + 2 * (b_stop[0] - a_stop[0])/4, a_stop[1] + 2 * (b_stop[1] - a_stop[1])/4]
    a3 = [a_stop[0] + 3 * (b_stop[0] - a_stop[0])/4, a_stop[1] + 3 * (b_stop[1] - a_stop[1])/4]
    b1 = [a1[0] + ratio * (ref_b[0] - ref_a[0]), a1[1] + ratio * (ref_b[1] - ref_a[1])]
    b2 = [a2[0] + ratio * (ref_b[0] - ref_a[0]), a2[1] + ratio * (ref_b[1] - ref_a[1])]
    b3 = [a3[0] + ratio * (ref_b[0] - ref_a[0]), a3[1] + ratio * (ref_b[1] - ref_a[1])]
    print str(a1) + ', ' + str(b1)
    print str(a2) + ', ' + str(b2)
    print str(a3) + ', ' + str(b3)

def get_zebras(a, b, c, n):
    for x in range(n):
        start = []
        end = []
        start.append(a[0] + (x + 1) * (c[0] - a[0])/(n))
        start.append(a[1] + (x + 1) * (c[1] - a[1])/(n))
        end.append(start[0] + b[0] - a[0])
        end.append(start[1] + b[1] - a[1])
        print str(start) + "," + str(end)


# Below starts simulation related
def get_positionbytime(a_appear, a_start, b_get):
    for x in range(a_start[2] - a_appear[2]):
            print str([a_appear[0], a_appear[1], x+1]) + ','
    t_move = b_get[2] - a_start[2]
    t = 0
    while t < t_move:
            x_new = a_start[0] + (b_get[0] - a_start[0]) * t / (b_get[2] - a_start[2])
            y_new = a_start[1] + (b_get[1] - a_start[1]) * t / (b_get[2] - a_start[2])
            print str([x_new, y_new, a_start[2] + t + 1]) + ','
            t += 1
# get_positionbytime([18.063593368489585, 59.3352888431697, 0], [18.063593368489585, 59.3352888431697, 50], [18.064326010284873, 59.3355074345595, 420])

def get_stream_straight(a, b, n, length, time_move, loop):
# n impacts vehicle speed, should meet length > n
# within the test so far, length = 60, loop = 300
        unit_x = (b[0] - a[0])/n
        unit_y = (b[1] - a[1])/n
        for i in range(time_move): # before moving
                vertices = []
                vertices.append(a)
                vertices.append(a)
                vertices.append(i)
                print str(vertices) + ','
        for i in range(n): # appearing
                vertices = []
                vertices.append(a)
                x1 = a[0] + unit_x * i
                y1 = a[1] + unit_y * i
                vertices.append([x1, y1])
                vertices.append(time_move + i)
                print str(vertices) + ','
        for i in range(length - n): # still stream on road
                vertices_still = []
                vertices_still.append(vertices[0])
                vertices_still.append(vertices[1])
                vertices_still.append(vertices[2] + i + 1)
                print str(vertices_still) + ','
        for i in range(n): # disappearing
                vertices = []
                x0 = a[0] + unit_x * i
                y0 = a[1] + unit_y * i
                vertices.append([x0, y0])
                vertices.append(b)
                vertices.append(time_move + length + i)
                print str(vertices) + ','
        for i in range(loop - vertices[2]): # after gone
                vertices_final = []
                vertices_final.append(vertices[1])
                vertices_final.append(vertices[1])
                vertices_final.append(vertices[2] + i + 1)
                print str(vertices_final) + ','
# left-right-1-middle
# get_stream_straight([18.06333965395432, 59.33562755134895],[18.063980251447692, 59.334975781121784], 60, 165, 860, 1800)
# left-right-2-middle
# get_stream_straight([18.063406024883758, 59.3356442930067],[18.06404662237713, 59.33499252277954], 60, 165, 870, 1800)
# left-right-2-first
# get_stream_straight([18.063406024883758, 59.3356442930067],[18.06404662237713, 59.33499252277954], 60, 275, 260, 1800)
# right-left-1
# get_stream_straight([18.064169603805208, 59.335023544086546],[18.063529006311835, 59.33567531431371], 60, 935, 560, 1800)
# right-left-2
# get_stream_straight([18.064230118476168, 59.3350388085392],[18.063589520982795, 59.33569057876637], 60, 940, 550, 1800)
# right-left-3
# get_stream_straight([18.064351147818083, 59.335069337444516],[18.06371055032471, 59.33572110767168], 60, 935, 560, 1800)